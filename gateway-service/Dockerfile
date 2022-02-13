FROM python:3.8.10
WORKDIR /zilean-gateway-service
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5006
CMD python app.py