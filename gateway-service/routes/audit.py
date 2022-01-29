import requests
from flask import Blueprint, request, jsonify
import sys
import json
import os
from dotenv import load_dotenv
load_dotenv()

AUDIT_SERVICE=os.environ.get('AUDIT_SERVICE')

audit_api = Blueprint('audit_api', __name__)


@audit_api.route('/v1/audit', methods=["POST"])
def createAudit():
    """
    Used to create an audit record
    @params - A POST request sent to the audit service to create a new user audit record
    @return - json of the created audit with an http status code
    """
    try:
        user_id = request.args.get('userid') or 1 
        response = requests.post(
            f'{AUDIT_SERVICE}/v1/audit',
            headers=request.headers,
            data=request.data
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code


@audit_api.route('/v1/audit', methods=["GET"])
def getPaginatedAudits(cursor=None, limit=10):
    """
    retrieving all active albums from the database.
    @params - A GET request that fetches audit records in paginated manner from database.
    @return - JSON formatted list of albums and http status code
    """
    try:
        response = requests.get(
            f'{AUDIT_SERVICE}/v1/audit'
        )
        response.raise_for_status()
        return response.json(), response.status_code

    except requests.exceptions.HTTPError as err:
        return err.response.text, err.response.status_code


