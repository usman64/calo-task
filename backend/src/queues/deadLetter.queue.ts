import { Queue } from "bullmq";

import { redisConnection } from "../config/redis.config";

export const deadLetterQueue = new Queue('deadLetterQueue', { connection: redisConnection });