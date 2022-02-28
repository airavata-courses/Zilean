from kafka import KafkaConsumer
import io
import base64
from time import sleep
import json
import os
import requests
from dotenv import load_dotenv
load_dotenv()

AUDIT_SERVICE=os.environ.get('AUDIT_SERVICE')

def insert_audit(audit_message):
    try:
        response = requests.post(
            f'{AUDIT_SERVICE}/v1/audits',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id":  audit_message.get('user_id'),
                "response": audit_message.get('response'),
                "request": audit_message.get('request'),
                "service_provider_identifier": audit_message.get('service_provider_identifier')
            })
        )
        response.raise_for_status()
    except Exception as err:
        return err


def main():
    try:
        consumer = KafkaConsumer('audit-queue', bootstrap_servers=[os.getenv('KAFKA_BROKER_URL') or 'localhost:29092'])
        while True:
            for message in consumer:
                audit_message = json.loads(message.value)
                insert_audit(audit_message)
    except Exception as err:
        print(err)
        return err

if __name__ == "__main__":
    main()