import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { WorkflowProvider } from './context/WorkflowContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WorkflowProvider>
          <App />
        </WorkflowProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
