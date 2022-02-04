import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from utils.authenticate import check_user_session
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
        response = requests.post(
            f'{DATA_RETRIEVAL_SERVICE}v1/retrieve-data',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id":  session_service_response.get('user_id'),
                "date": request_body.get('date'),
                "time": request_body.get('time'),
                "station": request_body.get('station')
            })
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code

