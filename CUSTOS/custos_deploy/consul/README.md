- `helm repo add hashicorp https://helm.releases.hashicorp.com`

Create directory /hashicorp/consul/data in each of your nodes, 

- `sudo chmod 777 -R hashichorp`

```
kubectl apply -f pv.yaml,pv1.yaml
kubectl apply -f storage.yaml
helm install consul hashicorp/consul --version 0.31.1 -n vault --values config.yaml
```

