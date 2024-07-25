# Calo-task

## High Level Design
Flow: Job creation, processing and real-time update back to Client
![High level design](high-level-design.png)
1. Client sends request to create job `POST /jobs`
2. Server generates a id and stores the job in pending state in DB
3. Adds job to a message queue (Jobs Queue)
4. Jobs worker processes job
5. If it succeeds it adds the result to results queue |||| If it fails it adds it to dead letter queue
6. Results worker picks it up |||| Dead letter worker picks it up
7. Results Worker updates the result in DB ||| Dead letter worker updates job status and error info in DB
8. Results/dead letter worker should publish the result to app server which subscribes to it
9. App server then relay it to the server as soon as it recieves he result through server side events which would
handle the unstable internet connecion issue and would be a better choice over websockets in this case.

Note: In code, step 8 is not handled as written here. I've mentioned the reason in backend/src/index.js

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
docker compose up
```
This would run a:
1. Node app server
2. Redis container to support `bullmq` message queues
3. Jobs worker

## Improvements:
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