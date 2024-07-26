import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { JobInfo } from "../components/jobInfo.component";
import { Header } from "../components/header.component";
import { JobContext } from "../context/job.context";
import { Job } from "../lib/types";
import { JOB_ACTIONS } from "../context/actions/job.actions";
import { Button } from "../components/button.component";

interface Params {
  id: string;
}

export function JobInfoPage(): JSX.Element {
  const { state, dispatch } = useContext(JobContext);
  const { id } = useParams<keyof Params>();
  const [jobNotFound, setJobNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<Job> = await axios.get<Job>(`/api/jobs/${jobId}`);
      dispatch({ type: JOB_ACTIONS.SET_JOB, payload: response.data });
      setJobNotFound(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setJobNotFound(true);
      } else {
        console.error('Error fetching job:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return <div>Please provide job id</div>;
  }

  if (jobNotFound) {
    return <div>Job not found</div>
  }

  return (
    <div className="flex flex-col items-center">
      <Header>Job Detail</Header>
      <Button 
        onClick={() => navigate('/jobs')}
        className="mb-6"
      >
        Back to Job List
      </Button>
      <div className="max-w-3xl">
        {loading ? (
          <div>Loading job details...</div>
        ) : (
          <JobInfo id={id} status={state.jobs[id]?.status} result={state.jobs[id]?.result} />
        )}
      </div>
    </div>
  );
}
