In your cluster master, do this for all nodes

` kubectl label nodes node_name custosServiceWorker="enabled"`


In your local or any other VM. 

```
git clone https://github.com/apache/airavata-custos.git
cd airavata-custos
git checkout develop
```


##### Deploying Custos Services

- First change the following parameters in pom.xml
    - <ssh.username>CHANGE_ME</ssh.username>   ( local ssh key password)
    - <ssh.privatekey>CHANGE_ME</ssh.privatekey> (local ssh privatekey)
    -  <host> CHANGE_ME</host> ( K8 cluster master rhost)
    - <spring.profiles.active>dev</spring.profiles.active> (current active profile)
    - <vault.token>CHANGE_ME</vault.token> ( vault token)
    - <iam.dev.username>CHANGE_ME}</iam.dev.username> ( keycloak  username)
    - <iam.dev.password>CHANGE_ME}</iam.dev.password> ( keycloak password)
    - <custos.email.password>CHANGE_ME</custos.email.password> (your email)
    - <spring.datasource.username>root</spring.datasource.username> (mysql database username)
    - <spring.datasource.password>UtahSALTlakeCITY</spring.datasource.password> (myslq password)
    - <docker.image.prefix>CHANGEME</docker.image.prefix> (dockerhub image prefix)
    - <docker.image.repo>CHAGEME</docker.image.repo> (dockerhub repo account)
    
-  Build code
    `mvn clean install -P container`

- Push code images to repo
   `mvn dockerfile:push -P container`

-  deploy artifacts
   `mvn antrun:run -P scp-to-remote`
