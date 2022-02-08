![Logo](https://github.com/airavata-courses/Zilean/blob/main/images/assets/zilean-banner.png)

## Team 

Spring 2022 Project Team

- Rushikesh Pharate
- Piyush Nalawade
- Aishwarya Sinhasane

## Napkin Diagram  

![Napkin](https://github.com/airavata-courses/Zilean/blob/main/images/napkin.png)


## System Architecture

![Final Architecture](https://github.com/airavata-courses/Zilean/blob/main/images/architecture/zilean-architecture.png)

## Branching Pattern  

![Napkin](https://github.com/airavata-courses/Zilean/blob/main/images/branching.png)

## Architecture Discussions

Note: These are architecture discussions recorded please visit final architecture above.

![Architecture](https://github.com/airavata-courses/Zilean/blob/main/images/architecture/architecture_1.png)

## Technology Stack

- NextJs (Frontend)
- SpringBoot (Java 15)
- Flask (Python 3.8+)
- Express (Node 10)
- MongoDB 
- PostgreSQL
- Apache Kafka, Zookeeper
- RESTful Webservices
- AWS S3
- Localstack
- Docker 
- Circle CI

## Project Installation

### Dependencies

Make sure you have these dependencies installed in your machine before installing each service.

- Node:10 
- Python 3.8+
- Java 15
- MongoDB
- PostgreSQL
- Maven

### Repository 
```
$ git clone https://github.com/airavata-courses/zilean.git

```

### Give permissions to sh files
```
$ chmod 755 zilean_setup.sh
$ chmod 755 start.sh
```


### Fetch all repositories  
```
$ ./zilean_setup.sh
```

### Run Kafka

Open new terminal in same tab
```
$ cd docker
$ docker compose -f kafka-docker-compose.yml up
```


### Run Localstack

Open new terminal in same tab
```
$ cd docker
$ docker compose -f s3-localstack.yml up
```

### Configure AWS for localstack

Open new terminal in same tab
```
$ aws configure 
```
access key = foo
secret key = foo 
default region = us-east-1
default ouput format = 


Create a local bucket naming 'plots'
```
aws --endpoint-url=http://localhost:4566 s3 mb s3://plots
```

### How to run

Start a service either by going to their respective folders or using the start script

#### Start Scripts (for linux based systems)
Each of these commands should be executed in different terminals.


#### Step 4 to start all microservices (each of them in separate teminal)
```shell
$ ./start.sh <arg> 
$
$ # Arg Values:
$ # front   : frontend-service
$ # gw : gateway-service
$ # user : user-service
$ # session : session-serice
$ # drs: data-retrieval-service
$ # plot: plot-service
$ # audit   : audit-service
$ # kafaq : kafka-audit-queue-service
$ # kafdq : kafka-data-retrieval-queue-service
$ # kafpq : kafka-plot-queue-service
```

### Manual Installations

- [!User Service](https://github.com/airavata-courses/Zilean/blob/main-user-service/user-service/README.md)
- [!Kafka Data Retrieval Queue](https://github.com/airavata-courses/Zilean/blob/main-data-retrieval-service/kafka-data-retrieval-queue/README.md)
- [!Kafka Audit Queue](https://github.com/airavata-courses/Zilean/blob/main-kafka-audit-queue/kafka-audit-queue/README.md)
- [!Kafka Plot Queue](https://github.com/airavata-courses/Zilean/blob/main-kafka-plot-queue/kafka-plot-queue/README.md)
- [!Session Service](https://github.com/airavata-courses/Zilean/blob/main-session-service/session-service/README.md)
- [!Audit Service](https://github.com/airavata-courses/Zilean/blob/main-audit-service/audit-service/README.md)
- [!Frontend](https://github.com/airavata-courses/Zilean/blob/main-frontend-service/frontend/README.md)
- [!Plot Service](https://github.com/airavata-courses/Zilean/blob/main-plot-service/plot-service/README.md)
- [!Data Retrieval Service](https://github.com/airavata-courses/Zilean/blob/main-data-retrieval-service/data-retrieval-service/README.md)
