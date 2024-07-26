import express from 'express';
import cors from "cors"
import 'dotenv/config';

import jobRoutes from './routes/job.routes';
import { serverSideEventsHandler } from './lib/serverSideEventsHandler';
import { initializeResultsWorker } from './workers/results.worker';
import { initializeDeadLetterWorker } from './workers/deadLetter.worker';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/live', serverSideEventsHandler);
app.use('/api/jobs', jobRoutes);

/*
 Note: Ideally results & deadletter workers below should not be initialised here and should run as separate node processes/deployed on lamda,
 but are not because of limited time.
 Problem: I faced race condition issue when multiple workers tried to update my local db (txt file) so didn't run them separately, but initialised here.
 I could improve it by locally implementing mutex locking or preferably refactoring my db layer to a managed db i.e mongoDB/DynamoDB etc which handles these 
 cases out of the box, but as I've limited time so adding them here on main server. I can explain on call how I would actually implement this/add a diagram on github
*/
initializeResultsWorker();
initializeDeadLetterWorker();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


