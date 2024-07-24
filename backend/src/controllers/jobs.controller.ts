import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import db from "../db";
import { retryOptions } from "../config/jobRetry.config";
import { JOB_STATUS, JobData } from "../lib/types";
import { jobQueue } from "../queues/jobs.queue";

const getJobs = (req: Request, res: Response): void => {
  const queryParams = req.query
  const pageSize: number = Number(queryParams?.pageSize);
  const pageNumber: number = Number(queryParams?.page);

  let data;
  if (pageSize && pageNumber) {
    data = db.getAll(pageNumber, pageSize);
  } else {
    data = db.getAll();
  }

  res.json({
   ...data
  })
};

const getJobById = (req: Request, res: Response): void => {
  const id = req.params.id;
  const result = db.getById(id)
  // if not found return not found
  res.json({ ...result})
};
  
const createJob = async (req: Request, res: Response): Promise<void> => {
  const jobId: string = uuid();
  const jobData: JobData = {
    id: jobId,
    status: JOB_STATUS.PENDING,
    result: undefined,
    created_at: Date.now(),
  }

  db.add(jobData)
  await jobQueue.add('job', jobData , retryOptions);

  res.json(jobData);
};

export default {
  getJobs,
  getJobById,
  createJob
}