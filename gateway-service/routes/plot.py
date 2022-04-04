import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from utils.authenticate import check_user_session
from dotenv import load_dotenv
load_dotenv()

from bson import json_util

sys.path.append(os.getcwd())
from utils.kafka_producer import kafka_producer


PLOT_SERVICE=os.environ.get('PLOT_SERVICE')
SESSION_SERVICE=os.environ.get('SESSION_SERVICE')

plot_api = Blueprint('plot_api', __name__)

@plot_api.route('/v1/plots', methods=["GET"])
def fetch_plot_requests():
    """
    Used to fetch plot requests from the plot service
    @params - A GET request sent to the /v1/plots endpoint
    @return - json of the plot requests
    """
    try:
        session_service_response = check_user_session(request.headers.get('Access-Token'))
        user_id = session_service_response.get('user_id')      
        request_body = json.loads(request.data)
        response = requests.get(
            f'{PLOT_SERVICE}/v1/plots',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id": user_id
            })
        )
        response.raise_for_status()
        kafka_producer.send('audit-queue', json.dumps({
            "user_id": user_id,
            "response": response.json(),
            "request": {},
            "service_provider_identifier": 'plot-service'
        }, default=json_util.default).encode('utf-8'))   
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code