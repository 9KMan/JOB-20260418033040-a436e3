import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Step7() {
  const { currentWorkflow } = useWorkflow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/');
      return;
    }
  }, [currentWorkflow]);

  const handleContinue = () => {
    navigate('/synthesis');
  };

  return (
    <div>
      <div className="step-container">
        <div className="step-header">
          <h2>Step 7: Review & Finalize</h2>
          <p>You've completed all the steps! Click below to review your complete instructional plan in the Synthesis view, where you can make final edits and adjustments.</p>
        </div>

        <div className="step-content">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <h3 style={{ marginBottom: '12px' }}>All Steps Complete!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your instructional plan is ready for review.
            </p>
          </div>
        </div>

        <div className="step-actions">
          <button className="btn btn-outline" onClick={() => navigate('/step/6')}>
            Back
          </button>
          <div className="step-nav">
            <button className="btn btn-success" onClick={handleContinue}>
              View Full Synthesis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
