#!/bin/bash

git clone -b main-gateway-service https://github.com/airavata-courses/Zilean.git
move Zilean/gateway-service .
del  Zilean


git clone -b main-audit-service https://github.com/airavata-courses/Zilean.git
move Zilean/audit-service .
del  Zilean


git clone -b main-user-service https://github.com/airavata-courses/Zilean.git
move Zilean/user-service .
del  Zilean


git clone -b main-session-service https://github.com/airavata-courses/Zilean.git
move Zilean/session-service .
del  Zilean


git clone -b main-data-retrieval-service https://github.com/airavata-courses/Zilean.git
move Zilean/data-retrieval-service .
del  Zilean


git clone -b main-plot-service https://github.com/airavata-courses/Zilean.git
move Zilean/plot-service .
del  Zilean

git clone -b main-kafka-audit-queue https://github.com/airavata-courses/Zilean.git
move Zilean/kafka-audit-queue .
del  Zilean

git clone -b main-kafka-data-retrieval-queue https://github.com/airavata-courses/Zilean.git
move Zilean/kafka-data-retrieval-queue .
del  Zilean

git clone -b main-kafka-plot-queue https://github.com/airavata-courses/Zilean.git
move Zilean/kafka-plot-queue .
del  Zilean

git clone -b main-frontend-service https://github.com/airavata-courses/Zilean.git
move Zilean/frontend .
del  Zilean

