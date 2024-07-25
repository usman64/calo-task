import { Job } from "../../lib/types";

export enum JOB_ACTIONS {
  SET_JOBS='SET_JOBS',
  SET_JOB='SET_JOB',
  UPDATE_JOB='UPDATE_JOB',
}

export type Action =
  | { type: JOB_ACTIONS.SET_JOBS; payload: Job[]; }
  | { type: JOB_ACTIONS.SET_JOB; payload: Job; }
  | { type: JOB_ACTIONS.UPDATE_JOB; payload: Job; }
