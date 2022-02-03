import imp
from turtle import pd
import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from dotenv import load_dotenv
load_dotenv()

USER_SERVICE=os.environ.get('USER_SERVICE')

user_api = Blueprint('user_api', __name__)


@user_api.route('/v1/signup', methods=["POST"])
def createUser():
    """
    Used to create an user
    @params - A POST request sent to the user service to create a new user
    @return - json of the created user with an http status code
    """
    try:
        import pdb
        pdb.set_trace()
        response = requests.post(
            f'{USER_SERVICE}/v1/signup',
            headers=request.headers,
            data=request.data
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code
