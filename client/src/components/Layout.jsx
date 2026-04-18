import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { currentWorkflow } = useWorkflow();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stepMatch = location.pathname.match(/^\/step\/(\d+)$/);
  const currentStep = stepMatch ? parseInt(stepMatch[1]) : null;
  const isInWorkflow = currentStep !== null;

  const stepLabels = [
    'Learning Goal',
    'Target Audience',
    'Success Criteria',
    'Content Outline',
    'Activities',
    'Assessment',
    'Synthesis'
  ];

  return (
    <div className="main-layout">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          AI Instructional Planner
        </Link>

        <div className="navbar-nav">
          {isInWorkflow && currentWorkflow && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Editing: {currentWorkflow.title}
            </span>
          )}
          <span className="nav-link">{user?.name || user?.email}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {isInWorkflow && (
        <div style={{ background: 'var(--surface)', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="step-indicators">
              <div className="progress-line">
                <div
                  className="progress-line-fill"
                  style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                />
              </div>
              {stepLabels.map((label, index) => {
                const stepNum = index + 1;
                const isCompleted = currentWorkflow && currentWorkflow.current_step > stepNum;
                const isCurrent = stepNum === currentStep;

                return (
                  <div
                    key={stepNum}
                    className={`step-indicator ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="step-number">
                      {isCompleted ? '✓' : stepNum}
                    </div>
                    <div className="step-label">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
