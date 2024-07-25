import { Worker } from "bullmq";

import { JobData } from "../lib/types";
import { redisConnection } from "../config/redis.config";
import { sendEvent } from "../lib/serverSideEventsHandler";
import JobModel from "../models/Job.model";

function initializeResultsWorker() {
  const worker = new Worker('resultsQueue', async job => {
    try {
      const {id, status, result }: JobData = job.data;
      JobModel.update(id, { status, result })
      sendEvent(JSON.stringify(job.data))
    } catch(err) {
      console.log("Error in results worker", err)
      throw err
    }
  }, { 
    connection: redisConnection,
    concurrency: 10,
    stalledInterval: 6*60*1000
  });
  
  worker.on('completed', job => {
    console.log(`Result worker completed for ${job.id}`);
  });
  
  worker.on('failed', (job, err) => {
    console.log(`Result worker failed for ${job?.id}: ${err}`);
  });
}

export { initializeResultsWorker };