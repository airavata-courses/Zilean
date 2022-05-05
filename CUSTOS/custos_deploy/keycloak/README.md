- `cd postgres`

### Deploy Postgresql
 `helm repo add bitnami https://charts.bitnami.com/bitnami`
####  Create PVs

Create three PVs for each mount point   /bitnami/postgresql
 -  `kubectl apply -f pv.yaml,pv1.yaml,pv2.yaml`   

Then deploy postgresql 

- `helm install keycloak-db-postgresql bitnami/postgresql -f values.yaml -n keycloak --version 10.12.3`

- `cd ..`


- `kubectl create -f https://raw.githubusercontent.com/operator-framework/operator-lifecycle-manager/master/deploy/upstream/quickstart/crds.yaml`
- `kubectl create -f https://raw.githubusercontent.com/operator-framework/operator-lifecycle-manager/master/deploy/upstream/quickstart/olm.yaml`

- `git clone https://github.com/keycloak/keycloak-operator`

- `cp operator.yaml keycloak-operator/deploy/`

- `cd keycloak-operator`

- `make cluster/prepare` 

- `kubectl apply -f deploy/operator.yaml -n keycloak`
-  `cd ..`

- `kubectl apply -f keycloak-db-secret.yaml -n keycloak`
- `kubectl apply -f custos-keycloak.yaml -n keycloak`

Replace hostname in ingress.yaml
- `kubectl apply -f ingress.yaml -n keycloak`


user: admin

Get admin password.

- `kubectl get secret credential-custos-keycloak -o yaml -n keycloak`

- `echo "passwordhere" | base64 --decode`


