import { Worker } from "bullmq";

import JobModel from "../models/Job.model";
import { redisConnection } from "../config/redis.config";
import { JobData } from "../lib/types";
import { sendEvent } from "../lib/serverSideEventsHandler";

function initializeDeadLetterWorker() {
  const worker = new Worker('deadLetterQueue', async job => {
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
    console.log(`Dead Letter worker completed for ${job.id}`);
  });
  
  worker.on('failed', (job, err) => {
    console.log(`Dead Letter worker failed for ${job?.id}: ${err}`);
  });
}

export { initializeDeadLetterWorker };