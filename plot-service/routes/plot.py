from turtle import pd
import requests
from flask import Blueprint, request
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
from utils.plot import plot_data
from botocore.exceptions import ClientError
import os

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
        print(request_id, user_id, target_link)
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
                boto3.setup_default_session(profile_name=os.environ.get('AWS_PROFILE'))
                if os.environ.get('USE_LOCAL'):
                    endpoint_url = 'http://localhost:4566/'
                else:
                    endpoint_url = 'undefined'

                client = boto3.client(
                    "s3", 
                    region_name=os.environ.get('AWS_REGION'),
                    endpoint_url=endpoint_url,
                )

                try:
                    client.upload_file(
                        f'{request_id}.png',
                        'plots',
                        'plot.png'
                    )
                except ClientError as e:
                    return {
                        "message": str(e)
                    }
        return {
            "message": "Success"
        }
    except Exception as err:
        print(err)
        return {
            "message": str(err)
        }

