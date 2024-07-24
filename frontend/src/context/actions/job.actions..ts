import { Job } from "../../lib/types";

export enum JOB_ACTIONS {
    SET_JOB='SET_JOB',
    SET_JOBS='SET_JOBS',
}

export type Action =
  | { type: JOB_ACTIONS.SET_JOBS; payload: Job[]; }
  | { type: JOB_ACTIONS.SET_JOB; payload: Job; }
