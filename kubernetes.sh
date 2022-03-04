#!/bin/bash

kubectl delete deployments --ignore-not-found=true user-container session-container audit-container
kubectl delete services --ignore-not-found=true user-container session-container audit-container

kubectl apply -f deployments/user-container.yaml
kubectl apply -f deployments/session-container.yaml
kubectl apply -f deployments/audit-container.yaml
