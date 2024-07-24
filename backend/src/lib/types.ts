import { Response } from 'express';

export interface JobResult {
  imageUrl: string
}

export enum JOB_STATUS {
  PENDING='pending',
  RESOLVED='resolved',
  ERROR="error",
}

export interface JobData {
  id: string;
  status: JOB_STATUS,
  result: JobResult | undefined;
  created_at?: number;
}

export interface EventSourceClient {
  id: number;
  res: Response;
}