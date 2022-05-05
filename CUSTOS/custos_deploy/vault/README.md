
#### Deploy Vault

`helm install vault hashicorp/vault     --namespace vault     -f values.yaml     --version 0.10.0`

Change hostname in ingress.yaml

#### Deploy Ingress

`kubectl apply -f ingress.yaml -n vault`

Follow instructions in UI which is hosted on 443 to generate vault token.
