import { JOB_STATUS } from "../lib/types";

interface ImageProps {
    imageUrl: string | undefined;
    JobStatus: JOB_STATUS | undefined;
}

export function Image( { imageUrl, JobStatus }: ImageProps): JSX.Element {
    if (JobStatus === JOB_STATUS.RESOLVED) {
        return <img className="object-cover w-full h-full" src={imageUrl}/>
    }
    
    return <img className="object-cover w-full h-full" src={'/placeholder.jpg'} /> 
}