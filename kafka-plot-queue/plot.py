
from kafka import KafkaConsumer
from ratelimiter import RateLimiter
import json
import os
import requests
from dotenv import load_dotenv
load_dotenv()

PLOT_SERVICE=os.environ.get('PLOT_SERVICE')
def nexrad(plot_message):
    return {
        "user_id":  plot_message.get('user_id'),
        "request_id": plot_message.get('request_id'),
        "s3_link": plot_message.get('s3_link'),
        "type":plot_message.get('type'),
        "original_request": plot_message.get('original_request')
    }

def merra(plot_message):
    return {
        "user_id":  plot_message.get('user_id'),
        "request_id": plot_message.get('request_id'),
        "url": plot_message.get('url'),
        "type":plot_message.get('type'),
        "original_request": plot_message.get('original_request')
    }

@RateLimiter(max_calls=5, period=60)
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
