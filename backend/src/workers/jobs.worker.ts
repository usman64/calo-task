import axios from 'axios';
import { Worker } from 'bullmq';
import 'dotenv/config';

import { redisConnection } from '../config/redis.config';
import { retryOptions } from '../config/jobRetry.config';
import { JOB_STATUS, JobData, JobResult } from '../lib/types';
import { resultsQueue } from '../queues/results.queue';
import { deadLetterQueue } from '../queues/deadLetter.queue';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

const worker = new Worker('jobQueue', async job => {
  try {
    const { id }: JobData = job.data;
    const result: JobResult = await processJob(id);
    await resultsQueue.add('result', {id, status: JOB_STATUS.RESOLVED, result: result.imageUrl}, retryOptions)
  } catch(err) {
    console.log("Error in jobs worker")
    throw err
  }
}, { 
  connection: redisConnection,
  concurrency: 10,
  stalledInterval: 6*60*1000
});

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err}`);
  deadLetterQueue.add('error', { id: job?.data?.id, status: JOB_STATUS.ERROR, result: JSON.stringify(err) }, retryOptions)
});

async function processJob(id: string): Promise<JobResult> {
  const randomDelay: number = Math.floor(Math.random() * 60) * 5000 + 5000;

  console.log(`Started processing Job ID: ${id}. ETA: ${randomDelay/1000/60} mins`)
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.get(UNSPLASH_API_URL, {
          params: {
            query: 'food',
            count: 1
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_TOKEN}`
          }
        });

        if (response.status === 200) {
          const imageUrl: string = response.data[0].urls.small;
          resolve({ imageUrl });
        } else {
          console.error('Unsplash API errors:', response.data.errors);
          reject(response.data.errors);
        }
      } catch (err) {
        console.error('Error fetching from Unsplash:', err);
        reject(JSON.stringify(err));
      }
    }, randomDelay);
  })
}
