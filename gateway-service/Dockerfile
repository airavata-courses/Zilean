FROM python:3.8-slim-buster

WORKDIR /usr/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip3 install --upgrade pip setuptools wheel
# Below RUN command is essential for installing some dependencies else pip install -r requirements.txt throws an error.
RUN apt-get update \
    && apt-get -y install libpq-dev gcc

ENV AUDIT_SERVICE=http://0.0.0.0:5001
ENV SESSION_SERVICE=http://0.0.0.0:5004
ENV USER_SERVICE=http://0.0.0.0:5005  
ENV PLOT_SERVICE=http://0.0.0.0:5002  
ENV KAFKA_BROKER_URL=localhost:9092

COPY ./requirements.txt ./
RUN pip3 install --no-cache -r requirements.txt

COPY ./ ./

CMD ["python", "app.py"]
