import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step2() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentWorkflow, getStep, updateStep } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    const step = getStep(2);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleSave = async () => {
    setSaving(true);
    await updateStep(2, { content });
    setSaving(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/3');
  };

  const handleBack = async () => {
    await handleSave();
    navigate('/step/1');
  };

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 2: Target Audience</h2>
          <p>Who are the learners for this instruction? Consider their prior knowledge, demographics, and learning preferences.</p>
        </div>

        <div className="step-content">
          <div className="form-group">
            <label htmlFor="content">Target Audience Description</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your target audience:&#10;&#10;- Age range/education level&#10;- Prior knowledge and experience&#10;- Learning preferences&#10;- Any special considerations or constraints"
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
