#!/bin/bash

set -e

SCRIPT_DIR=$(dirname $0)
$SCRIPT_DIR/awscli-setup.sh

echo 'Make sure localstack container up and running...'
docker-compose -f docker-compose-localstack.yml up -d

while ! nc -z localhost 8085; do
    sleep 1 # wait for 1/10 of the second before check again
done

echo 'Setting up local queues...'

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name=audit-sevice-audit-creation