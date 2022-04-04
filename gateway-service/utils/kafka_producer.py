import os
from sys import api_version
from dotenv import load_dotenv
load_dotenv()


from kafka import KafkaProducer
kafka_producer = KafkaProducer(bootstrap_servers=os.getenv('KAFKA_BROKER_URL') or 'localhost:29092', max_block_ms=180000,api_version=(0,10))