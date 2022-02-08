from dotenv import load_dotenv
load_dotenv()


from kafka import KafkaProducer
kafka_producer = KafkaProducer(bootstrap_servers='localhost:29092')