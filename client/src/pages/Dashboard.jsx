import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Dashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchWorkflows, createWorkflow, deleteWorkflow, loadWorkflow } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    const data = await fetchWorkflows();
    setWorkflows(data);
    setLoading(false);
  };

  const handleCreateWorkflow = async () => {
    const workflow = await createWorkflow('New Instructional Plan');
    if (workflow) {
      navigate('/step/1');
    }
  };

  const handleSelectWorkflow = async (id) => {
    const workflow = await loadWorkflow(id);
    if (workflow) {
      const step = workflow.current_step || 1;
      navigate(`/step/${Math.min(step, 7)}`);
    }
  };

  const handleDeleteWorkflow = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const success = await deleteWorkflow(id);
      if (success) {
        setWorkflows(workflows.filter(w => w.id !== id));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercent = (currentStep) => {
    return Math.min(((currentStep - 1) / 6) * 100, 100);
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Instructional Plans</h1>
        <button className="btn btn-primary" onClick={handleCreateWorkflow}>
          + New Plan
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="empty-state">
          <h2>No instructional plans yet</h2>
          <p>Create your first instructional plan to get started with the AI-powered workflow.</p>
          <button className="btn btn-primary" onClick={handleCreateWorkflow}>
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="workflow-card"
              onClick={() => handleSelectWorkflow(workflow.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{workflow.title}</h3>
                <button
                  className="btn btn-outline"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={(e) => handleDeleteWorkflow(e, workflow.id)}
                >
                  Delete
                </button>
              </div>
              <div className="workflow-card-meta">
                <p>Step {workflow.current_step} of 7</p>
                <p>Last updated: {formatDate(workflow.updated_at)}</p>
              </div>
              <div className="workflow-card-progress">
                <div
                  className="workflow-card-progress-bar"
                  style={{ width: `${getProgressPercent(workflow.current_step)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
