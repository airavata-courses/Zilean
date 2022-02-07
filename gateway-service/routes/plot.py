import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from utils.authenticate import check_user_session
from dotenv import load_dotenv
load_dotenv()


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
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code
