import path from "path";

import { JobData } from "../lib/types";
import { Database } from "../db";

const JobModel = new Database<JobData>(path.join(__dirname, '..', '..', 'data', `jobs_data.${process.env.NODE_ENV}.txt`));

export default JobModel;