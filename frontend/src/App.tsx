import { Route, Routes } from 'react-router-dom'
import { useContext, useEffect } from 'react';

import { JobContext } from './context/job.context';
import { IRoute, ROUTES } from './routes';
import { JOB_ACTIONS } from './context/actions/job.actions';
import { Job } from './lib/types';

function App() {
  const { dispatch } = useContext(JobContext);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3002/live')
    eventSource.onmessage = (e): void => {
      const jobData: Job = JSON.parse(e.data);
      dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: jobData });
    }
  }, [])

  return (
    <div>
      <Routes>
        { ROUTES.map((route: IRoute) => (
          <Route key={route.path} path={route.path} element={route.element}/>
        ))}
      </Routes>
    </div>
  )
}

export default App
