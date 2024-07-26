import { Image } from "./image.component";
import { Spinner } from "./spinner.component";
import { JOB_STATUS } from "../lib/types";
import React from "react";

interface JobInfoProps {
  id: string | undefined;
  status: JOB_STATUS | undefined;
  result: string | undefined;
  hoverEnabled?: boolean;
}

export const JobInfo: React.FC<JobInfoProps> = React.memo(({ id, status, result, hoverEnabled }) => {
  const getStatusColorClass = (status: JOB_STATUS | undefined): string => {
    switch (status) {
      case JOB_STATUS.RESOLVED:
        return 'bg-green-400';
      case JOB_STATUS.ERROR:
        return 'bg-red-400';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className={`block bg-gray-100 border border-gray-100 rounded-lg shadow ${hoverEnabled ? 'hover:bg-gray-300' : ''}`}>
      <div className="p-6">
        <div className="text-left mb-5"><strong>ID:</strong> {id}</div>
        <div className="text-left"> 
          <strong>Status:</strong> 
          <span className={`ml-2 p-2 rounded-lg ${getStatusColorClass(status)} text-gray-800`}>
            { status === JOB_STATUS.PENDING && <Spinner /> }
            {status?.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="w-full h-64 overflow-hidden flex items-center justify-center">
        <Image JobStatus={status} imageUrl={result} />
      </div>
    </div>
  );
});
