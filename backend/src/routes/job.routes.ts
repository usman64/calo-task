import express from "express"

import jobsController from "../controllers/jobs.controller";

const router = express.Router();

router.get('/', jobsController.getJobs);
router.get('/:id', jobsController.getJobById);
router.post('/', jobsController.createJob);

export default router;