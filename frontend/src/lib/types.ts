export type Job = {
  id: string;
  status: JOB_STATUS;
  result: string;
};

export enum JOB_STATUS {
  PENDING='pending',
  RESOLVED='resolved',
  ERROR='error'
}