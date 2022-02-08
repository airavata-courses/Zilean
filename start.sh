#!/bin/bash
if  [ "$1" == "front" ]; then 
    cd  frontend && npm install && npm run dev

elif [ "$1" == "gw" ]; then
    cd gateway-service && python3 -m venv env && pwd && source ./env/bin/activate &&  pip install -r requirements.txt && python app.py

elif [ "$1" == "user" ]; then
    cd user-service && python3 -m venv env && pwd && source ./env/bin/activate &&  pip install -r requirements.txt && python app.py

elif [ "$1" == "session" ]; then
    cd session-service && rm -rf target && mvn clean && mvn clean install && cd target && java -jar -Dspring.profiles.active=local SessionService-0.0.1-SNAPSHOT.jar

elif [ "$1" == "drs" ]; then
    cd data-retrieval-service && python3 -m venv env && pwd && source ./env/bin/activate &&  pip install -r requirements.txt && ./manage.py runserver

elif [ "$1" == "plot" ]; then
    cd plot-service && python3 -m venv env && source ./env/bin/activate &&  pip install -r requirements.txt && python app.py

elif [ "$1" == "audit" ]; then
    cd audit-service && npm install && npm start

elif [ "$1" == "kafaq" ]; then
    cd kafka-audit-queue && python3 -m venv env  && source ./env/bin/activate &&  pip install -r requirements.txt && python insertaudit.py

elif [ "$1" == "kafdq" ]; then
    cd kafka-data-retrieval-queue && python3 -m venv env  && source ./env/bin/activate &&  pip install -r requirements.txt && python data_retrieval_request.py

elif [ "$1" == "kafpq" ]; then
    cd kafka-plot-queue && python3 -m venv env && source ./env/bin/activate &&  pip install -r requirements.txt && python plot.py


elif [ "$1" == "help" ]; then
    echo ""
    echo "Usage: ./start.sh <arg>"
    echo ""
    echo "Arg Values:"
    echo "front : frontend"
    echo "gw : gateway-service "
    echo "user   : user-service"
    echo "session : session-service"
    echo "drs  : data-retrieval-service"
    echo "plot : plot-service"
    echo "audit : audit-service"
    echo "kafaq   : kafka-audit-queue"
    echo "kafdq  : kafka-data-retrieval-queue"
    echo "kafpq   : kafka-plot-queue"
    echo ""
    echo ":)"
fi