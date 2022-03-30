import os
import requests
from flask import jsonify, request
import json
from dotenv import load_dotenv
load_dotenv()

SESSION_SERVICE=os.environ.get('SESSION_SERVICE')

def check_user_session(accessToken):
    try:
        access_token  = accessToken
        response = requests.get(
            f'{SESSION_SERVICE}/v1/session-service/validate',
            headers={
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "access_token": access_token
            })
        )
                
        if response.json().get('status') != 200:
            raise requests.exceptions.HTTPError(response.json().get('message'), response.status_code)

        return response.json()

    except requests.exceptions.HTTPError as err:
            return response.json(), 401