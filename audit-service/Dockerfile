# Base image
FROM node:alpine

WORKDIR /usr/app

# copy all files from current directory to docker container
COPY ./package.json ./
RUN npm install

ENV PORT=5001
ENV NODE_ENV=dev

# database specific env variables
ENV DB_USERNAME=audit_service_test
ENV DB_PASSWORD=audit_service_test
ENV DB_DATABASE=audit_service_test
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_CONNECTION=postgres
ENV DB_CONNECTION_POOL_MAX_CONNECTIONS=6
ENV DB_CONNECTION_POOL_MIN_CONNECTIONS=1
ENV SQL_LOGGING_ENABLED=true

COPY ./ ./

CMD ["npm","run", "start"] 

