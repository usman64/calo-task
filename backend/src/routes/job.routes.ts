import express from "express"

import jobsController from "../controllers/jobs.controller";

const router = express.Router();

router.get('/jobs', jobsController.getJobs);
router.get('/jobs/:id', jobsController.getJobById);
router.post('/jobs', jobsController.createJob);

export default router;