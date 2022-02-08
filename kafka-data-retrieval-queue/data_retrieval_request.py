
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

def data_retrieval_request(dret_req_message):
    try:
        print(dret_req_message)
        response = requests.post(
            f'{DATA_RETRIEVAL_SERVICE}/v1/retrieve-data',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id":  dret_req_message.get('user_id'),
                "date": dret_req_message.get('date'),
                "time": dret_req_message.get('time'),
                "station": dret_req_message.get('station')
            })
        )
        response.raise_for_status()
    except Exception as err:
        print(err)


def main():
    try:
        consumer = KafkaConsumer('data-retrieval-queue', bootstrap_servers=['localhost:29092'])
        while True:
            for message in consumer:
                data_retrieval_request_message = json.loads(message.value)
                data_retrieval_request(data_retrieval_request_message)
    except Exception as err:
        print(err)
        
if __name__ == "__main__":
    main()