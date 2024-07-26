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

export interface JobsResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Job[]
}