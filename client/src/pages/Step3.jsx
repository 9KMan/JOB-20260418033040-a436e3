import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step3() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentWorkflow, getStep, updateStep } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    const step = getStep(3);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleSave = async () => {
    setSaving(true);
    await updateStep(3, { content });
    setSaving(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/4');
  };

  const handleBack = async () => {
    await handleSave();
    navigate('/step/2');
  };

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 3: Success Criteria</h2>
          <p>How will you know if the learning was successful? Define measurable outcomes and performance standards.</p>
        </div>

        <div className="step-content">
          <div className="form-group">
            <label htmlFor="content">Success Criteria</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Define what success looks like:&#10;&#10;- Performance objectives (e.g., &quot;Learners will score at least 80% on the assessment&quot;)&#10;- Observable behaviors or actions&#10;- Quality standards for completed work&#10;- Any required certifications or credentials"
            />
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn-outline" onClick={handleBack} disabled={saving}>
            Back
          </button>
          <div className="step-nav">
            <button className="btn btn-primary" onClick={handleNext} disabled={saving}>
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
