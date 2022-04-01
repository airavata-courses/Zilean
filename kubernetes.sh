#!/bin/bash

# kubectl delete deployments --ignore-not-found=true user-container session-container audit-container postgresql-container
# kubectl delete services --ignore-not-found=true user-container session-container audit-container postgresql-container

kubectl apply -f deployments/user-container.yaml
kubectl apply -f deployments/session-container.yaml
kubectl apply -f deployments/audit-container.yaml
kubectl apply -f deployments/postgresql-container.yaml
kubectl apply -f deployments/mongodb-container.yaml
kubectl apply -f deployments/localstack-container.yaml
kubectl apply -f deployments/plot-container.yaml
kubectl apply -f deployments/kafka-container.yaml
kubectl apply -f deployments/gateway-container.yaml