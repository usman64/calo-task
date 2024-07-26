import request from 'supertest';
import express from 'express';
import jobRoutes from '../routes/job.routes';
import { JOB_STATUS } from '../lib/types';
import JobModel from '../models/Job.model';

const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);

describe('Job Controller', () => {
  beforeEach(() => {
    JobModel.clear();
  });

  it('should create a new job', async () => {
    const response = await request(app).post('/api/jobs').send({});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe(JOB_STATUS.PENDING);
  });

  it('should get all jobs', async () => {
    await request(app).post('/api/jobs').send({});
    const response = await request(app).get('/api/jobs');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should get job by id', async () => {
    const postResponse = await request(app).post('/api/jobs').send({});
    const jobId = postResponse.body.id;
    const getResponse = await request(app).get(`/api/jobs/${jobId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', jobId);
  });
});
