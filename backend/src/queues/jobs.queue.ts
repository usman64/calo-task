import { Queue } from "bullmq";

import { redisConnection } from "../config/redis.config";

export const jobQueue = new Queue('jobQueue', { connection: redisConnection });