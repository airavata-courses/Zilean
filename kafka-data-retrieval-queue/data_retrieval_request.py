
from kafka import KafkaConsumer
import io
import base64
from time import sleep
import json
import os
import requests
from dotenv import load_dotenv
load_dotenv()

DATA_RETRIEVAL_SERVICE=os.environ.get('DATA_RETRIEVAL_SERVICE')
def nexrad(request_body):
    return {
        "user_id": request_body.get('user_id'),
        "type": request_body.get('type'),
        "date": request_body.get('date'),
        "time": request_body.get('time'),
        "station":request_body.get('station')
    }

def merra(request_body):
    return {
        "user_id": request_body.get('user_id'),
        "type": request_body.get('type'),
        "date": request_body.get('date'),
        "time": request_body.get('time')
    }
def data_retrieval_request(dret_req_message):
    try:
        print(dret_req_message)
        context_switcher = {
            'nexrad': nexrad,
            'merra': merra
        }
        if dret_req_message.get('type') not in context_switcher.keys():
            raise Exception('Invalid request type')
        
        response = requests.post(
            f'{DATA_RETRIEVAL_SERVICE}/v1/retrieve-data',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps(context_switcher.get(dret_req_message.get('type'))(dret_req_message))
        )
        response.raise_for_status()
    except Exception as err:
        print(err)

def main():
    try:
        consumer = KafkaConsumer('data-retrieval-queue', bootstrap_servers=[os.getenv('KAFKA_BROKER_URL') or 'localhost:29092'])
        while True:
            for message in consumer:
                data_retrieval_request_message = json.loads(message.value)
                data_retrieval_request(data_retrieval_request_message)
    except Exception as err:
        print(err)
        
if __name__ == "__main__":
    main()