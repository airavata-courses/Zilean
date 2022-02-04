import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from utils.authenticate import check_user_session
from dotenv import load_dotenv
load_dotenv()

AUDIT_SERVICE=os.environ.get('AUDIT_SERVICE')
SESSION_SERVICE=os.environ.get('SESSION_SERVICE')

audit_api = Blueprint('audit_api', __name__)

@audit_api.route('/v1/audits', methods=["POST"])
def createAudit():
    """
    Used to create an audit record
    @params - A POST request sent to the audit service to create a new user audit record
    @return - json of the created audit with an http status code
    """
    try:

        session_service_response = check_user_session(request.headers.get('Access-Token'))
        audit_request_body = json.loads(request.data)
        response = requests.post(
            f'{AUDIT_SERVICE}/v1/audits',
            headers={
                'Content-Type': 'application/json'
            },
            data=json.dumps({
                "user_id":  session_service_response.get('user_id'),
                "response": audit_request_body.get('response'),
                "request": audit_request_body.get('request'),
                "service_provider_identifier": audit_request_body.get('service_provider_identifier')
            })
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code


@audit_api.route('/v1/audits', methods=["GET"])
def getPaginatedAudits(cursor=None, limit=10):
    """
    retrieving all active albums from the database.
    @params - A GET request that fetches audit records in paginated manner from database.
    @return - JSON formatted list of albums and http status code
    """
    try:
        session_service_response = check_user_session(request.headers.get('Access-Token'))
        user_id = session_service_response.get('user_id')         
        response = requests.get(
            f'{AUDIT_SERVICE}/v1/audits',
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


