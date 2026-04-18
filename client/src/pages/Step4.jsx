import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step4() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { currentWorkflow, getStep, updateStep, generateContentOutline, loadWorkflow } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }

    // Load workflow to ensure we have latest data
    loadWorkflow(currentWorkflow.id);

    const step = getStep(4);
    if (step && step.data && step.data.content) {
      setContent(step.data.content);
    }
  }, [currentWorkflow]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateStep(4, { content }, false);
    setSaving(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const generatedContent = await generateContentOutline();
      if (generatedContent) {
        setContent(generatedContent);
      } else {
        setError('Failed to generate content outline. Please ensure you have completed Steps 1-3.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate content outline');
    }
    setGenerating(false);
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/step/5');
  };

  const handleBack = async () => {
    await handleSave();
    navigate('/step/3');
  };

  const step1 = getStep(1);
  const step2 = getStep(2);
  const step3 = getStep(3);

  const canGenerate = step1?.data?.content && step2?.data?.content && step3?.data?.content;

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 4: Content Outline</h2>
          <p>Create a structured outline of the content to be covered. You can either write it manually or use AI assistance.</p>
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
                Complete Steps 1-3 first to enable AI generation
              </span>
            )}
          </div>

          <div className="ai-output-container">
            <div className="ai-output-header">
              <h4>
                Content Outline
                {getStep(4)?.ai_generated && <span className="ai-badge">AI Generated</span>}
              </h4>
            </div>
            <div className="ai-output-content">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter your content outline here, or click 'Generate with AI' to create one automatically.&#10;&#10;Use markdown format for structure:&#10;# Module 1&#10;## Topic 1.1&#10;- Key point 1&#10;- Key point 2"
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
