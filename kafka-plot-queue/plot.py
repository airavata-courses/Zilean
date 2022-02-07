
from kafka import KafkaConsumer
import json
import os
import requests
from dotenv import load_dotenv
load_dotenv()

PLOT_SERVICE=os.environ.get('PLOT_SERVICE')

def plot_queue(plot_message):
    try:
        print(plot_message)
        response = requests.post(
            f'{PLOT_SERVICE}/v1/plots',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id":  plot_message.get('user_id'),
                "request_id": plot_message.get('request_id'),
                "s3_link": plot_message.get('s3_link'),
            })
        )
        response.raise_for_status()
    except Exception as err:
        print(err)


def main():
    try:
        consumer = KafkaConsumer('plot-queue', bootstrap_servers=['localhost:29092'])
        while True:
            for message in consumer:
                plot_message = json.loads(message.value)
                plot_queue(plot_message)
    except Exception as err:
        print(err)
        
if __name__ == "__main__":
    main()