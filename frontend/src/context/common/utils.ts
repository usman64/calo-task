import { Job } from "../../lib/types"
import { JobStateType } from "./types"

export const transformToMap = (payload: Job[]): JobStateType => {
  const jobs: JobStateType = {}
  payload.forEach((job: Job): void => { jobs[job.id] = job })
  return jobs
}