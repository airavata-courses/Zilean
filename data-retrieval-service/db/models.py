import os
from pymongo import MongoClient

from dotenv import load_dotenv
load_dotenv()

if os.environ.get('MONGO_URI'):
    uri=os.environ.get('MONGO_URI')
else:   
    uri = "mongodb://localhost:27017"
    
db = MongoClient(uri)['request-service']
# Add collections in this list
collections = ['requests']

for collection in collections:
    if collection in db.list_collection_names():
        print(collection + ' exists')
    else:
        db[collection]
