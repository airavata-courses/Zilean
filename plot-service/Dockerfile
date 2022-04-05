FROM ubuntu:18.04

WORKDIR /usr/app


RUN apt update &&  apt -y install software-properties-common && add-apt-repository ppa:deadsnakes/ppa && apt -y install libpq-dev gcc
RUN apt -y install python3.9 && python3.9 --version
RUN apt -y install python3-pip && pip3 install --upgrade pip  && pip3 install --upgrade setuptools
RUN apt -y install libgeos-dev && apt-get -y install libproj-dev
RUN apt -y install proj-bin

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./ ./

RUN  pip3 install numpy==1.19.5  && pip3 install cartopy==0.18.0 
RUN python3 -m pip install -r requirements.txt
RUN touch $HOME/.netrc 
RUN echo "machine urs.earthdata.nasa.gov login AishwaryaSinhasane password Aishwarya@4" >> $HOME/.netrc
RUN chmod 0600 $HOME/.netrc
RUN touch $HOME/.urs_cookies
# fixing shapely version issue
RUN pip install shapely --upgrade --force-reinstall --no-binary shapely 

COPY ./.netrc ~/.

CMD ["python3", "app.py"]
