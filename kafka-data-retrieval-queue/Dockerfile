FROM python:3
WORKDIR /usr/src/app
COPY . .
RUN pip install --no-cache -r requirements.txt
CMD ["python3", "data_retrieval_request.py"]