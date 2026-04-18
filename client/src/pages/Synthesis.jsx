import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Synthesis() {
  const [steps, setSteps] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const { currentWorkflow, loadWorkflow, updateStep, getStep } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    loadWorkflow(currentWorkflow.id);
  }, [currentWorkflow]);

  useEffect(() => {
    // Load all steps
    const stepsData = {};
    for (let i = 1; i <= 6; i++) {
      const step = getStep(i);
      if (step) {
        stepsData[i] = step;
      }
    }
    setSteps(stepsData);
  }, [getStep]);

  const handleContentChange = (stepNumber, content) => {
    setSteps(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        data: { ...prev[stepNumber]?.data, content }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      for (let i = 1; i <= 6; i++) {
        if (steps[i]) {
          await updateStep(i, { content: steps[i].data.content }, steps[i].ai_generated);
        }
      }
      setSaveMessage('All changes saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving changes');
    }

    setSaving(false);
  };

  const handleDownload = () => {
    const content = `
# ${currentWorkflow?.title || 'Instructional Plan'}

---

## 1. Learning Goal
${steps[1]?.data?.content || 'Not provided'}

---

## 2. Target Audience
${steps[2]?.data?.content || 'Not provided'}

---

## 3. Success Criteria
${steps[3]?.data?.content || 'Not provided'}

---

## 4. Content Outline
${steps[4]?.data?.content || 'Not provided'}

---

## 5. Learning Activities
${steps[5]?.data?.content || 'Not provided'}

---

## 6. Assessment Methods
${steps[6]?.data?.content || 'Not provided'}

---

*Generated with AI Instructional Planner*
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentWorkflow?.title || 'instructional-plan'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentWorkflow) {
    return null;
  }

  const stepLabels = {
    1: 'Learning Goal',
    2: 'Target Audience',
    3: 'Success Criteria',
    4: 'Content Outline',
    5: 'Learning Activities',
    6: 'Assessment'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Instructional Plan Synthesis</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={handleDownload}>
            Download as Markdown
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div style={{
          background: saveMessage.includes('Error') ? '#fef2f2' : '#f0fdf4',
          color: saveMessage.includes('Error') ? 'var(--danger)' : 'var(--success)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          {saveMessage}
        </div>
      )}

      <div className="synthesis-grid">
        {Object.entries(stepLabels).map(([num, label]) => (
          <div className="synthesis-card" key={num}>
            <h3>
              {num}. {label}
              {steps[num]?.ai_generated && <span className="ai-badge" style={{ marginLeft: '8px' }}>AI</span>}
            </h3>
            <div className="content">
              <textarea
                value={steps[num]?.data?.content || ''}
                onChange={(e) => handleContentChange(parseInt(num), e.target.value)}
                placeholder={`${label} content...`}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
