
from kafka import KafkaConsumer
import json
import os
import requests
from dotenv import load_dotenv
load_dotenv()

PLOT_SERVICE=os.environ.get('PLOT_SERVICE')
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
    }

def plot_queue(plot_message):
    try:
        print(plot_message)
        context_switcher = {
            'nexrad': nexrad,
            'merra': merra
        }

        if plot_message.get('type') not in context_switcher.keys():
            raise Exception('Invalid request type')
        
        response = requests.post(
            f'{PLOT_SERVICE}/v1/plots',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps(context_switcher.get(plot_message.get('type'))(plot_message))
        )
        response.raise_for_status()
    except Exception as err:
        print(err)


def main():
    try:
        consumer = KafkaConsumer('plot-queue', bootstrap_servers=[ os.getenv("KAFKA_BROKER_URL") or 'localhost:29092'])
        while True:
            for message in consumer:
                plot_message = json.loads(message.value)
                plot_queue(plot_message)
    except Exception as err:
        print(err)
        
if __name__ == "__main__":
    main()