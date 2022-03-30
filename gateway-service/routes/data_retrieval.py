import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from bson import json_util

# sys.path.append(os.getcwd())

from utils.authenticate import check_user_session
from utils.kafka_producer import kafka_producer

from dotenv import load_dotenv
load_dotenv()


DATA_RETRIEVAL_SERVICE=os.environ.get('DATA_RETRIEVAL_SERVICE')

data_fetch_api = Blueprint('data_fetch_api', __name__)

@data_fetch_api.route('/v1/weather/request', methods=["POST"])
def createWeatherData():
    """
    Used to create an weather request record
    @params - A POST request sent to the data retrieval service to create a new weather retrieval record
    @return - json of the created data retrieval with an http status code
    """
    try:
        session_service_response = check_user_session(request.headers.get('Access-Token'))
        request_body = json.loads(request.data)
        type = request_body.get('type')
        user_id = session_service_response.get('user_id')
        if type == 'nexrad':
        
            kafka_producer.send('data-retrieval-queue', json.dumps({
                "user_id": user_id,
                "type": request_body.get('type'),
                "date": request_body.get('date'),
                "time": request_body.get('time'),
                "station":request_body.get('station')
            }, default=json_util.default).encode('utf-8'))
            
            kafka_producer.send('audit-queue', json.dumps({
                "user_id": user_id,
                "response": {},
                "request": request.data,
                "service_provider_identifier": 'data-retrieval-service'
            }, default=json_util.default).encode('utf-8'))   
        else:
            kafka_producer.send('data-retrieval-queue', json.dumps({
                "user_id": user_id,
                "type": request_body.get('type'),
                "date": request_body.get('date'),
            }, default=json_util.default).encode('utf-8'))
            
            kafka_producer.send('audit-queue', json.dumps({
                "user_id": user_id,
                "response": {},
                "request": request.data,
                "service_provider_identifier": 'data-retrieval-service'
            }, default=json_util.default).encode('utf-8'))   
        
        return {"message": "You request will be processed in short time"}, 200
    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code

