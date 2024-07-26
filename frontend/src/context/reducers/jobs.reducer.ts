import { Action, JOB_ACTIONS } from "../actions/job.actions";
import { State } from "../common/types";
import { transformToMap } from "../common/utils";

export const jobReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case JOB_ACTIONS.SET_JOBS:
      state = { jobs: transformToMap(action.payload)};
      return state
    case JOB_ACTIONS.SET_JOB:
      state.jobs[action.payload.id] = action.payload
      state = { jobs: {...state.jobs} };
      return state
    case JOB_ACTIONS.UPDATE_JOB:
      if (state.jobs[action.payload.id]) {
        state.jobs[action.payload.id] = action.payload
        state = { jobs: {...state.jobs} };
      } 
      return state
    default:
      return state;
  }
};