```
kubectl apply -f pv.yaml,pv1.yaml
helm install mysql bitnami/mysql -f values.yaml -n custos --version 8.8.8
```