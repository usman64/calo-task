import express from 'express';
import cors from "cors"
import 'dotenv/config';

import jobRoutes from './routes/job.routes';
import { liveUpdatesHandler } from './lib/sse';
import { initializeResultsWorker } from './workers/results.worker';
import { initializeDeadLetterWorker } from './workers/deadLetter.worker';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/live', liveUpdatesHandler);
app.use('/api', jobRoutes);

/*
 ideally these workers should not be here and run as separate node process.
 But, added them on main server due to time constraint. Otherwise, I would
 store the clients in another Redis instane and these workers would get those clients
 from that Redis instance and run the sendEvents functions on them.
*/
initializeResultsWorker();
initializeDeadLetterWorker();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


