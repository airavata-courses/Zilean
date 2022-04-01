FROM python:3.9-buster

WORKDIR /usr/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip3 install --upgrade pip setuptools wheel
# Below RUN command is essential for installing some dependencies else pip install -r requirements.txt throws an error.
RUN apt-get update \
    && apt-get -y install libpq-dev gcc

COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt

COPY ./ ./

CMD ["python", "app.py"]
