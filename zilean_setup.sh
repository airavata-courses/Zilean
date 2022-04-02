#!/bin/bash

git clone -b main-gateway-service https://github.com/airavata-courses/Zilean.git
mv Zilean/gateway-service .
rm -rf Zilean


git clone -b main-audit-service https://github.com/airavata-courses/Zilean.git
mv Zilean/audit-service .
rm -rf Zilean


git clone -b main-user-service https://github.com/airavata-courses/Zilean.git
mv Zilean/user-service .
rm -rf Zilean


git clone -b main-session-service https://github.com/airavata-courses/Zilean.git
mv Zilean/session-service .
rm -rf Zilean


git clone -b main-data-retrieval-service https://github.com/airavata-courses/Zilean.git
mv Zilean/data-retrieval-service .
rm -rf Zilean


git clone -b main-plot-service https://github.com/airavata-courses/Zilean.git
mv Zilean/plot-service .
rm -rf Zilean

git clone -b main-kafka-audit-queue https://github.com/airavata-courses/Zilean.git
mv Zilean/kafka-audit-queue .
rm -rf Zilean

git clone -b main-kafka-data-retrieval-queue https://github.com/airavata-courses/Zilean.git
mv Zilean/kafka-data-retrieval-queue .
rm -rf Zilean

git clone -b main-kafka-plot-queue https://github.com/airavata-courses/Zilean.git
mv Zilean/kafka-plot-queue .
rm -rf Zilean

git clone -b main-frontend-service https://github.com/airavata-courses/Zilean.git
mv Zilean/frontend .
rm -rf Zilean
