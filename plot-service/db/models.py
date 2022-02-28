import os
from pymongo import MongoClient

if os.environ.get('MONGO_URI'):
    uri = os.environ.get('MONGO_URI')
else:
    uri = "mongodb://0.0.0.0:27017"
db = MongoClient(uri)['plot-service']
# Add collections in this list
collections = ['plots']

for collection in collections:
    if collection in db.list_collection_names():
        print(collection + ' exists')
    else:
        db[collection]
