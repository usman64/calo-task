import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx'

import './index.css'
import { JobProvider } from './context/job.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <JobProvider>
        <App />
      </JobProvider>
    </Router>
  </React.StrictMode>,
)
