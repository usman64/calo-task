import { ReactNode } from "react";

import { Job } from "../lib/types";

export type JobStateType = Partial<{ [key: string]: Job; }>;

export type State = {
  jobs: JobStateType;
};

export type JobProviderProps = {
  children: ReactNode;
};