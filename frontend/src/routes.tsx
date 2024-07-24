import { Navigate } from "react-router-dom";

import { JobListPage } from "./pages/jobList.page";
import { JobInfoPage } from "./pages/jobDetail.page";
import { NotFoundPage } from "./pages/404.page";

export interface IRoute {
  path: string;
  element: JSX.Element
}

export const ROUTES: IRoute[] = [
  {
      path: '/',
      element: <Navigate to='/jobs' />
  },
  {
      path: '/jobs',
      element: <JobListPage />
  },
  {
      path: 'jobs/:id',
      element: <JobInfoPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
