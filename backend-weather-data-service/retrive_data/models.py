from pymongo import MongoClient

uri = "mongodb://localhost:27017"
db = MongoClient(uri)['request-service']
# Add collections in this list
collections = ['requests']

for collection in collections:
    if collection in db.list_collection_names():
        print(collection + ' exists')
    else:
        db[collection]
