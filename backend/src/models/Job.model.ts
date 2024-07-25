import path from "path";

import { JobData } from "../lib/types";
import { Database } from "../db";

const JobModel = new Database<JobData>(path.join(__dirname, 'jobsdata.txt'));

export default JobModel;