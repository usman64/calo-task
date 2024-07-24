import { Queue } from "bullmq";

import { redisConnection } from "../config/redis.config";

export const resultsQueue = new Queue('resultsQueue', { connection: redisConnection });