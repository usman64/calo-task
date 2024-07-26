import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { JobInfo } from '../components/jobInfo.component';
import { Header } from '../components/header.component';
import { Button } from '../components/button.component';
import { JobContext } from '../context/job.context';
import { Job } from '../lib/types';
import { JOB_ACTIONS } from '../context/actions/job.actions';
import { PAGE_SIZE } from '../lib/constants';
import Pagination from '../components/pagination.component';

export const JobListPage: React.FC = React.memo(() => {
  const { state, dispatch } = useContext(JobContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page: number) => {
    try {
      const response = await axios.get<{data: Job[]}>(`/api/jobs?page=${page}&pageSize=${PAGE_SIZE}`);
      console.log(response.data)
      // @ts-ignore
      setTotal(response.data?.total)
      dispatch({ type: JOB_ACTIONS.SET_JOBS, payload: response.data.data });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleCreateJob = async () => {
    try {
      await axios.post('/api/jobs');
      fetchJobs(currentPage)
      // alert('New job created')
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create new created')
    }
  };

  // Memoize the jobs array for performance
  const memoizedJobs = useMemo(() => Object.values(state.jobs), [state.jobs])

  return (
    <div className='ml-5 text-center'>
      <Header>Job List</Header>
      <Button onClick={handleCreateJob}>Create New Job</Button>
      { 
        memoizedJobs.length ? 
          <Pagination
            total={total}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          /> : <div> No Jobs to display. Please create new jobs </div> 
      }
      <div className='grid grid-cols-3 gap-4'>
        {
          memoizedJobs.map(job => (
            <div className='my-5 hover:cursor-pointer' key={job?.id} onClick={() => navigate(`/jobs/${job?.id}`)}>
              <JobInfo id={job?.id} status={job?.status} result={job?.result} hoverEnabled/>
            </div>
          ))
        }
      </div>
    </div>
  );
});

export default JobListPage;
