import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step5() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { currentWorkflow, getStep, updateStep, generateActivities, loadWorkflow } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    loadWorkflow(currentWorkflow.id);

    const step = getStep(5);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateStep(5, { content }, false);
    setSaving(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const generatedContent = await generateActivities();
      if (generatedContent) {
        setContent(generatedContent);
      } else {
        setError('Failed to generate activities. Please ensure you have completed Steps 1-4.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate activities');
    }
    setGenerating(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/6');
  };

  const handleBack = async () => {
    await handleSave();
    navigate('/step/4');
  };

  const step4 = getStep(4);
  const canGenerate = step4?.data?.content;

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 5: Learning Activities</h2>
          <p>Design engaging activities that will help learners achieve the objectives. Use AI to generate activity suggestions based on your content outline.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="step-content">
          <div style={{ marginBottom: '16px' }}>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={generating || !canGenerate}
            >
              {generating ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                  Generating with AI...
                </>
              ) : (
                '✨ Generate with AI'
              )}
            </button>
            {!canGenerate && (
              <span style={{ marginLeft: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Complete Step 4 (Content Outline) first to enable AI generation
              </span>
            )}
          </div>

          <div className="ai-output-container">
            <div className="ai-output-header">
              <h4>
                Learning Activities
                {getStep(5)?.ai_generated && <span className="ai-badge">AI Generated</span>}
              </h4>
            </div>
            <div className="ai-output-content">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Describe the learning activities here, or click 'Generate with AI' to create them automatically.&#10;&#10;Include:&#10;- Activity name and type&#10;- Duration&#10;- Materials needed&#10;- Step-by-step instructions"
              />
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn-outline" onClick={handleBack} disabled={saving || generating}>
            Back
          </button>
          <div className="step-nav">
            <button className="btn btn-primary" onClick={handleNext} disabled={saving || generating}>
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
