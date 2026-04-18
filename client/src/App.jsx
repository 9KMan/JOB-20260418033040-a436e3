import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';
import Step5 from './pages/Step5';
import Step6 from './pages/Step6';
import Step7 from './pages/Step7';
import Synthesis from './pages/Synthesis';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-container">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="step/1" element={<Step1 />} />
          <Route path="step/2" element={<Step2 />} />
          <Route path="step/3" element={<Step3 />} />
          <Route path="step/4" element={<Step4 />} />
          <Route path="step/5" element={<Step5 />} />
          <Route path="step/6" element={<Step6 />} />
          <Route path="step/7" element={<Step7 />} />
          <Route path="synthesis" element={<Synthesis />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
