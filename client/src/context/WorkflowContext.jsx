import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const { token } = useAuth();
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [steps, setSteps] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchWorkflows = useCallback(async () => {
    if (!token) return [];

    const res = await fetch('/api/workflow', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data.workflows;
    }
    return [];
  }, [token]);

  const createWorkflow = useCallback(async (title = 'Untitled Plan') => {
    if (!token) return null;

    const res = await fetch('/api/workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentWorkflow(data.workflow);
      setSteps({});
      return data.workflow;
    }
    return null;
  }, [token]);

  const loadWorkflow = useCallback(async (id) => {
    if (!token) return null;

    setLoading(true);
    try {
      const res = await fetch(`/api/workflow/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentWorkflow(data.workflow);

        const stepsMap = {};
        data.steps.forEach(step => {
          stepsMap[step.step_number] = step;
        });
        setSteps(stepsMap);

        return data.workflow;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, [token]);

  const updateStep = useCallback(async (stepNumber, data, aiGenerated = false) => {
    if (!currentWorkflow || !token) return null;

    const res = await fetch(`/api/workflow/${currentWorkflow.id}/steps/${stepNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data, ai_generated: aiGenerated })
    });

    if (res.ok) {
      const result = await res.json();
      setSteps(prev => ({
        ...prev,
        [stepNumber]: result.step
      }));

      // Refresh workflow to update current_step
      if (stepNumber >= currentWorkflow.current_step) {
        const workflowRes = await fetch(`/api/workflow/${currentWorkflow.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (workflowRes.ok) {
          const workflowData = await workflowRes.json();
          setCurrentWorkflow(workflowData.workflow);
        }
      }

      return result.step;
    }
    return null;
  }, [currentWorkflow, token]);

  const getStep = useCallback((stepNumber) => {
    return steps[stepNumber] || null;
  }, [steps]);

  const generateContentOutline = useCallback(async () => {
    if (!currentWorkflow || !token) return null;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/content-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workflowId: currentWorkflow.id })
      });

      if (res.ok) {
        const data = await res.json();
        setSteps(prev => ({
          ...prev,
          4: data.step
        }));
        return data.content;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, [currentWorkflow, token]);

  const generateActivities = useCallback(async () => {
    if (!currentWorkflow || !token) return null;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workflowId: currentWorkflow.id })
      });

      if (res.ok) {
        const data = await res.json();
        setSteps(prev => ({
          ...prev,
          5: data.step
        }));
        return data.content;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, [currentWorkflow, token]);

  const generateAssessment = useCallback(async () => {
    if (!currentWorkflow || !token) return null;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workflowId: currentWorkflow.id })
      });

      if (res.ok) {
        const data = await res.json();
        setSteps(prev => ({
          ...prev,
          6: data.step
        }));
        return data.content;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, [currentWorkflow, token]);

  const deleteWorkflow = useCallback(async (id) => {
    if (!token) return false;

    const res = await fetch(`/api/workflow/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return res.ok;
  }, [token]);

  const value = {
    currentWorkflow,
    steps,
    loading,
    fetchWorkflows,
    createWorkflow,
    loadWorkflow,
    updateStep,
    getStep,
    generateContentOutline,
    generateActivities,
    generateAssessment,
    deleteWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
