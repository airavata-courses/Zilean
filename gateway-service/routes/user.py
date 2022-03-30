
import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from dotenv import load_dotenv
from bson import json_util

sys.path.append(os.getcwd())
from utils.kafka_producer import kafka_producer
load_dotenv()




USER_SERVICE=os.environ.get('USER_SERVICE')
SESSION_SERVICE=os.environ.get('SESSION_SERVICE')


user_api = Blueprint('user_api', __name__)


@user_api.route('/v1/user/signup', methods=["POST"])
def createUser():
    """
    Used to create an user
    @params - A POST request sent to the user service to create a new user
    @return - json of the created user with an http status code
    """
    try:
        response = requests.post(
            f'{USER_SERVICE}/v1/user/signup',
            headers={
                'Content-Type': 'application/json'
            },
            data=request.data
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code


@user_api.route('/v1/user/login', methods=["POST"])
def checkUser():
    """
    Used to check user exists
    @params - A GET request sent to the user service to check user exists
    @return - json of the existing user with an http status code
    """
    try:
        user_service_response = requests.get(
            f'{USER_SERVICE}/v1/user/login',
            headers=request.headers,
            data=request.data
        )
        user_service_response.raise_for_status()

        user_id = user_service_response.json().get('user_id')

        kafka_producer.send('audit-queue', json.dumps({
            "user_id": user_id,
            "response": user_service_response.json(),
            "request": request.data,
            "service_provider_identifier": 'user-service'
        }, default=json_util.default).encode('utf-8'))

        session_service_response = requests.post(
            f'{SESSION_SERVICE}/v1/session-service/create-session',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                'user_id': user_id
        }))
        session_service_response.raise_for_status()
        kafka_producer.send('audit-queue', json.dumps({
            "user_id": user_id,
            "response": session_service_response.json(),
            "request": request.data,
            "service_provider_identifier": 'session-service'
        }, default=json_util.default).encode('utf-8'))
        return session_service_response.json(), session_service_response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code

