# Calo-task

## High Level Design
Flow: Job creation, processing and real-time update back to Client
![High level design](high-level-design.png)
1. Client sends request to create job `POST /jobs`
2. Server generates a id and stores the job in pending state in DB
3. Adds job to a message queue (Jobs Queue)
4. Returns response to FE with Job id and pending status
5. Jobs worker processes job
6. If it succeeds it adds the result to results queue else if it fails it adds it to the dead letter queue
7. If it
    - a. suceeds, Results worker picks it up
    - b. fails, Dead letter worker picks it up
8. If it
    - a. suceeds, Results Worker updates the result in DB
    - b. fails, Dead letter worker updates job status and error info in DB
9. If it
    - a. suceeds, Results worker publishes the result to the app server which subscribes to it
    - b. fails, Dead letter worker would publish the result to the app server which subscribes to it
10. App server then relays the result and status to the server as soon as it recieves it through server side events which would be a better choice over websockets in this case where there's unstable internet connecion issue b/w client and server. 

Note: In code, step 9 is not handled as written here. I've mentioned the reason in backend/src/index.js

## Setup Instructions
### Frontend: React App
Open a terminal and inside the `frontend` directory run 
```
npm i
npm run dev
```
You should be able to access the app on `http://localhost:5173/`


### Backend: Node App
Open a terminal and inside the `backend` directory run
```
docker compose up --build
```
This would run a:
1. Node app server in a docker container
2. Redis container to support `bullmq` message queues
3. Jobs worker in a docker container
4. Volume to retain db data and let containers read/write it

## Future Improvements:
Backend:
1. Add an API Gateway to add
    - rate limiting since unsplash API supports only 50 requests per hour in free mode
    - reverse proxy as if we would horizontally scale our app servers we'll need it
2. Add a loadbalancer to load balance if we scale up app servers
2. Manage scalability for
    - Node app server by adding it to a ASG on AWS or orchestration through K8s
    - Worker by deploying it on any serverless service i.e lamda
3. Refactor DB layer to add a managed DB i.e MongoDB/DynamoDB so that we can also run results and deadLetter worker separately on lamda as well for scalability
    - When deploying on lamda we'll need pub/sub to between worker and app server who will send server side events
4. Download images for jobs and serve them through CDN, so that we don't have to hit unsplash repeatedly for images and would reduce latency. But, CDN is expensive so alternatively you can store images in S3 and add a caching layer infront of it.

Frontend:
1. Cache images (May use browser caching or Nextjs which provides image caching out of the box)
2. Initialise both projects with a monorepo framework or orchestrator like TurboRepo to use commonly shared interfaces i.e Job interface etc. TurboRepo also provides support for remote caching which would make builds super fast.