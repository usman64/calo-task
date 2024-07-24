import React, { createContext, useReducer } from 'react';

import { Action } from './actions/job.actions.';
import { jobReducer } from './reducers/jobs.reducer';
import { JobProviderProps, State } from './types';

const initialState: State = {
  jobs: {},
};

export const JobContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

export const JobProvider = ({ children }: JobProviderProps) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  return (
    <JobContext.Provider value={{ state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
};