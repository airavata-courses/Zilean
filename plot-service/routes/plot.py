import requests
from flask import Blueprint, request
import boto3
import botocore
from botocore.client import Config
# from sympy import im
from metpy.io import Level2File
from utils.plot import plot_data
from botocore.exceptions import ClientError
import os
from db.models import db
from datetime import datetime

plot_api = Blueprint('plot_api', __name__)


@plot_api.route('/v1/plots', methods=["POST"])
def create_plot():
    """
    Used to create an plot and store its s3 link
    @params - A POST request sent to the plot service to create a plot of weather data
    @return - json of the created plot image s3 link
    """
    try:
        request_data = request.get_json()
        request_id = request_data.get('request_id')
        user_id = request_data.get('user_id')
        target_link = request_data.get('s3_link')
        original_request = request_data.get("original_request")

        if target_link == 'NEXRAD-S3-LINK-NOT-FOUND':
            plot_link = 'NEXRAD-S3-LINK-NOT-FOUND'
        else:
            s3 = boto3.resource(
                's3',
                config=Config(
                    signature_version=botocore.UNSIGNED,
                    user_agent_extra='Resource'
                )
            )
            for obj in s3.Bucket('noaa-nexrad-level2').objects.filter(Prefix=target_link.split('noaa-nexrad-level2/')[1]):
                f = Level2File(obj.get()['Body'])
                plot_data(f, request_id)
                with open(f'{request_id}.png') as pltfile:
                    
                    if os.environ.get('USE_LOCAL'):
                        endpoint_url = 'http://localhost:4566'
                    else:
                        endpoint_url = 'undefined'
                    boto3.setup_default_session(profile_name=os.environ.get('AWS_PROFILE'))
                    client = boto3.client(
                        "s3", 
                        region_name=os.environ.get('AWS_REGION'),
                        endpoint_url=endpoint_url,
                    )
                    response = client.upload_file(
                        f'{request_id}.png',
                        'plots',
                        f'{request_id}.png'
                    )

                    if os.environ.get('USE_LOCAL'):
                        plot_link = f'http://localhost:4566/plots/{request_id}.png'
                    else:
                        bucket_location = boto3.client('s3').get_bucket_location(Bucket='plots')                 
                        plot_link = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                            bucket_location['LocationConstraint'],
                            'plots',
                            f'{request_id}.png'
                        )
        db['plots'].insert_one({
            'plot_link': plot_link,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': 'DATA_RETRIEVAL_FAILURE' if plot_link == 'NEXRAD-S3-LINK-NOT-FOUND' else 'PROCESSED' ,
            'original_request': original_request
        })          
        return {
            "message": "Success"
        }
    except Exception as err:
        db['plots'].insert_one({
            'plot_link': 'NEXRAD-S3-LINK-NOT-FOUND',
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': 'IMAGE_PARSING_FAILURE',
            'original_request': original_request
        })      
        print(err)
        return {
            "message": str(err)
        }


@plot_api.route('/v1/plots', methods=["GET"])
def get_plots():
    """
    Used to return plots from s3
    @params - A GET request sent to the plot service to get plots of weather data
    @return - json of the plots s3 object
    """
    try:
        request_data = request.get_json()
        user_id = request_data.get('user_id')
        plots = db['plots'].find({ 'user_id': user_id }, { 'plot_link': 1, 'request_id': 1, '_id': 0, 'created_at': 1, 'original_request': 1,'status': 1}).sort('created_at',-1)
        json_plots = []
        for plot in plots:
            json_plots.append({
                "request_id": plot.get('request_id'),
                "created_at": str(plot.get('created_at')),
                "plot_link": plot.get('plot_link'),
                "request": plot.get('original_request'),
                "status": plot.get('status')
            })  
        return {
            "message": "Success",
            "plots": json_plots
        }
    except Exception as err:
        print(err)
        return {
            "message": str(err)
        }

