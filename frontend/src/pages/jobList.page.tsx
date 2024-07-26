import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { JobInfo } from '../components/jobInfo.component';
import { Header } from '../components/header.component';
import { Button } from '../components/button.component';
import { JobContext } from '../context/job.context';
import { JobsResponse, Job } from '../lib/types';
import { JOB_ACTIONS } from '../context/actions/job.actions';
import { PAGE_SIZE } from '../lib/constants';
import Pagination from '../components/pagination.component';

export function JobListPage(): JSX.Element {
  const { state, dispatch } = useContext(JobContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page: number): Promise<void> => {
    try {
      const response: AxiosResponse<JobsResponse> = await axios.get<JobsResponse>(`/api/jobs?page=${page}&pageSize=${PAGE_SIZE}`);
      setTotal(response.data?.total);
      dispatch({ type: JOB_ACTIONS.SET_JOBS, payload: response.data.data });
      setError(null); // Show toast message as an improvement
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again later.');
    }
  };

  const handleCreateJob = async (): Promise<void> => {
    try {
      await axios.post('/api/jobs');
      fetchJobs(currentPage);
      setError(null);
    } catch (err) {
      console.error('Error creating job:', err);
      alert('Failed to create new job.');
    }
  };

  const memoizedJobs: Job[] = useMemo(() => Object.values(state.jobs), [state.jobs]) as Job[];

  return (
    <div className='mx-4 sm:mx-6 lg:mx-8 text-center'>
      <Header>Job List</Header>
      <Button onClick={handleCreateJob} className="mb-4">Create New Job</Button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {
        memoizedJobs.length ? (
          <>
            <Pagination
              total={total}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setCurrentPage(page)}
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {
                memoizedJobs.map((job: Job) => (
                  <div className='my-5 hover:cursor-pointer' key={job?.id} onClick={() => navigate(`/jobs/${job?.id}`)}>
                    <JobInfo id={job?.id} status={job?.status} result={job?.result} hoverEnabled />
                  </div>
                ))
              }
            </div>
          </>
        ) : (
          <div>No Jobs to display. Please create new jobs</div>
        )
      }
    </div>
  );
}

export default JobListPage;
