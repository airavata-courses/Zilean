import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from dotenv import load_dotenv
load_dotenv()

SESSION_SERVICE=os.environ.get('SESSION_SERVICE')


session_api = Blueprint('session_api', __name__)


@session_api.route('/v1/user/logout', methods=["POST"])
def logoutUser():
    """
    Used to logout user
    @params - A POST request sent to the session service to delete user session
    @return - json with http status code
    """
    try:
        accessToken = request.headers.get('Access-Token')
        session_service_response = requests.post(
            f'{SESSION_SERVICE}/v1/session-service/logout',
            headers={
                'Access-Token': accessToken,
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "access_token": accessToken
            })
        )
        session_service_response.raise_for_status()
        return session_service_response.json(), session_service_response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code