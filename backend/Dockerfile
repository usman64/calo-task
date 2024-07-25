FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

ENV NODE_ENV=development

CMD ["npm", "run", "start-server"]
