# Base image
FROM node:alpine

WORKDIR /usr/app

# copy all files from current directory to docker container
COPY ./package.json ./
RUN npm install

COPY ./ ./
# Default command that will run when we start an instace of the image
CMD ["npm","run","start"] 

