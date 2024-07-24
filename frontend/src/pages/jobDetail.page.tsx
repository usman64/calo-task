import axios from "axios";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { JobInfo } from "../components/jobInfo.component";
import { Header } from "../components/header.component";
import { JobContext } from "../context/job.context";
import { Job } from "../lib/types";
import { JOB_ACTIONS } from "../context/actions/job.actions.";


export function JobInfoPage(): JSX.Element {
  const { state, dispatch } = useContext(JobContext);
  const { id } = useParams();

  useEffect(() => {
    fetchJob();
  }, [])

  const fetchJob = async () => {
    try {
      const response = await axios.get<Job>(`http://localhost:3002/api/jobs/${id}`); // proxy url
      dispatch({ type: JOB_ACTIONS.SET_JOB, payload: response.data });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  if (!id) {
    return (
      <div>Please provide job id</div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Header>Job Detail</Header>
      <div className="max-w-3xl">
        <JobInfo id={id} status={state.jobs[id]?.status} result={state.jobs[id]?.result}/>
      </div>
    </div>
  )
}