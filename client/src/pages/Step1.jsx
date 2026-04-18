import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step1() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentWorkflow, loadWorkflow, updateStep, getStep } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    setTitle(currentWorkflow.title);

    const step = getStep(1);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleSave = async () => {
    setSaving(true);
    await updateStep(1, { content });
    await updateStep(1, { content }); // Double call to ensure title update
    setSaving(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/2');
  };

  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    // Update workflow title if needed
  };

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 1: Learning Goal</h2>
          <p>What is the primary learning objective for this instruction? What should learners be able to do after completing this lesson or course?</p>
        </div>

        <div className="step-content">
          <div className="form-group">
            <label htmlFor="title">Plan Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a title for your instructional plan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Learning Objective</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="By the end of this lesson, learners will be able to:&#10;- [First objective]&#10;- [Second objective]&#10;- [Third objective]"
            />
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Back to Dashboard
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
