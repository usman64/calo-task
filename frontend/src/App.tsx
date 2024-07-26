import { Route, Routes } from 'react-router-dom';
import { useContext, useEffect } from 'react';

import { JobContext } from './context/job.context';
import { IRoute, ROUTES } from './routes';
import { JOB_ACTIONS } from './context/actions/job.actions';
import { Job } from './lib/types';

function App() {
  const { dispatch } = useContext(JobContext);

  useEffect(() => {
    let eventSource: EventSource;
    try {
      eventSource = new EventSource('/api/live');
      eventSource.onmessage = (e): void => {
        try {
          const jobData: Job = JSON.parse(e.data);
          dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: jobData });
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };
    } catch (error) {
      console.error('Error initializing EventSource:', error);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div>
      <Routes>
        {ROUTES.map((route: IRoute) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
