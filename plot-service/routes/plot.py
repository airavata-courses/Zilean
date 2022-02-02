import requests
from flask import Blueprint, request
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
from utils.plot import plot_data
from botocore.exceptions import ClientError


plot_api = Blueprint('plot_api', __name__)


@plot_api.route('/v1/plot', methods=["POST"])
def create_plot():
    """
    Used to create an plot and store its s3 link
    @params - A POST request sent to the plot service to create a plot of
     weather data
    @return - json of the created plot image s3 link
    """
    try:
        request_data = request.get_json()
        user_id = request_data.get('user_id') or 1
        target_link = request_data.get('target_link') or ''

        s3 = boto3.resource(
            's3',
            config=Config(
                signature_version=botocore.UNSIGNED,
                user_agent_extra='Resource'
            )
        )

        bucket = s3.Bucket('noaa-nexrad-level2')
        for obj in bucket.objects.filter(
                Prefix=target_link or '2019/06/26/KVWX/KVWX20190626_221105_V06'):

            f = Level2File(obj.get()['Body'])

            plot_data(f)
            with open('plot.png') as pltfile:
                client = boto3.client(
                    's3',
                    region_name='us-east-2',
                    aws_access_key_id='ABC',
                    aws_secret_access_key='ABC'
                )
                try:
                    response = client.upload_file(
                        'plot.png',
                        'short-video-clips',
                        'plot.png'
                    )
                    print(response)
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

