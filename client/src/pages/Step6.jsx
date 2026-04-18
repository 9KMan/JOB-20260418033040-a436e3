import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step6() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { currentWorkflow, getStep, updateStep, generateAssessment, loadWorkflow } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    loadWorkflow(currentWorkflow.id);

    const step = getStep(6);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateStep(6, { content }, false);
    setSaving(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const generatedContent = await generateAssessment();
      if (generatedContent) {
        setContent(generatedContent);
      } else {
        setError('Failed to generate assessment. Please ensure you have completed Steps 1-5.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate assessment');
    }
    setGenerating(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/7');
  };

  const handleBack = async () => {
    await handleSave();
    navigate('/step/5');
  };

  const step5 = getStep(5);
  const canGenerate = step5?.data?.content;

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 6: Assessment Methods</h2>
          <p>Design assessments that measure whether learners have achieved the success criteria. Include both formative and summative assessments.</p>
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
                Complete Step 5 (Activities) first to enable AI generation
              </span>
            )}
          </div>

          <div className="ai-output-container">
            <div className="ai-output-header">
              <h4>
                Assessment Methods
                {getStep(6)?.ai_generated && <span className="ai-badge">AI Generated</span>}
              </h4>
            </div>
            <div className="ai-output-content">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Describe your assessment methods here, or click 'Generate with AI' to create them automatically.&#10;&#10;Include:&#10;- Assessment name and type (formative/summative)&#10;- Purpose and connection to objectives&#10;- Format and structure&#10;- Grading criteria or rubric"
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
