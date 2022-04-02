import requests
from flask import Blueprint, request
import boto3
import botocore
from botocore.client import Config
from metpy.io import Level2File
from utils.plot import plot_nexrad_data, plot_merra_data, convert_merra_data
import os
from db.models import db
from datetime import datetime

plot_api = Blueprint('plot_api', __name__)

def nexrad(request_data):
    try:
        request_id = request_data.get('request_id')
        user_id = request_data.get('user_id')
        target_link = request_data.get('s3_link')
        original_request = request_data.get("original_request")
        plot_link = None

        existing_plot = db['plots'].find_one({
            "target_link": target_link,
            "status": "PROCESSED"
        })
        if existing_plot:
            db['plots'].insert_one({
            'plot_link': existing_plot['plot_link'],
            'target_link': existing_plot['target_link'],
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': existing_plot['status'],
            'original_request': original_request
            })
            return {
                "message": "Success"
            }   

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
                plot_nexrad_data(f, request_id)
                with open(f'{request_id}.png') as pltfile:
                    if bool(os.environ.get('USE_LOCAL')):
                        endpoint_url = os.getenv("S3_HOST") or 'http://localhost:4566'
                    else:
                        endpoint_url = os.getenv("S3_HOST")
                    boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
                    client = boto3.client(
                        "s3", 
                        region_name=os.environ.get('AWS_REGION'),
                        endpoint_url=endpoint_url,
                    )
                    response = client.upload_file(
                        f'{request_id}.png',
                        os.getenv('S3_BUCKET'),
                        f'{request_id}.png',
                        ExtraArgs={'ACL': 'public-read'}
                    )

                    if bool(os.environ.get('USE_LOCAL')):
                        plot_link = f'http://localhost:4566/plots/{request_id}.png'
                    else:
                        bucket_location = boto3.client('s3').get_bucket_location(Bucket=os.getenv('S3_BUCKET'))                 
                        plot_link = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                            bucket_location['LocationConstraint'],
                            os.getenv('S3_BUCKET'),
                            f'{request_id}.png'
                        )

        stat =  'UNKNOWN_ERROR'
        if plot_link == 'NEXRAD-S3-LINK-NOT-FOUND':
            stat =  'DATA_RETRIEVAL_FAILURE'
        elif plot_link == '' or  plot_link == None:
            stat = 'IMAGE_PARSING_FAILURE'
        else:
            stat = 'SUCCESS'
        db['plots'].insert_one({
            'plot_link': '' if not plot_link else plot_link,
            'target_link': target_link,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': stat,
            'original_request': original_request
        })          
        return {
            "message": "Success"
        }
    except Exception as err:
        db['plots'].insert_one({
            'plot_link': 'NEXRAD-S3-LINK-NOT-FOUND',
            'user_id': user_id,
            'target_link': target_link,
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

def merra(request_data):
    try:
        request_id = request_data.get('request_id')
        user_id = request_data.get('user_id')
        target_link = request_data.get('url')
        original_request = request_data.get("original_request")
        plot_link = None
        year, month, day = original_request['date'].split("-") 
        FILENAME = year+"-"+month+"-"+day+".nc4"
        

        existing_plot = db['plots'].find_one({
            "target_link": target_link,
            "status": "PROCESSED"
        })
        if existing_plot:
            db['plots'].insert_one({
            'plot_link': existing_plot['plot_link'],
            'target_link': existing_plot['target_link'],
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': existing_plot['status'],
            'original_request': original_request
            })
            return {
                "message": "Success"
            }   
        result = requests.get(target_link)
        try:
            result.raise_for_status()
            f = open(FILENAME,'wb')
            f.write(result.content)
            f.close()
            print('contents of URL written to '+FILENAME)
        except:
            target_link = 'MERRA-LINK-NOT-FOUND'
            print('requests.get() returned an error code '+str(result.status_code))

        if target_link == 'MERRA-LINK-NOT-FOUND':
            plot_link = 'MERRA-LINK-NOT-FOUND'
        else:
            s3 = boto3.resource(
                's3',
                config=Config(
                    signature_version=botocore.UNSIGNED,
                    user_agent_extra='Resource'
                )
            )
            
            FILENAME = convert_merra_data(FILENAME,request_data)
            plot_merra_data(FILENAME, request_data)
            with open(f'{request_id}.png') as pltfile:
                if bool(os.environ.get('USE_LOCAL')):
                    endpoint_url = os.getenv("S3_HOST") or 'http://localhost:4566'
                else:
                    endpoint_url = os.getenv("S3_HOST")
                boto3.setup_default_session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
                client = boto3.client(
                    "s3", 
                    region_name=os.environ.get('AWS_REGION'),
                    endpoint_url=endpoint_url,
                )
                response = client.upload_file(
                    f'{request_id}.png',
                    os.getenv('S3_BUCKET'),
                    f'{request_id}.png',
                    ExtraArgs={'ACL': 'public-read'}
                )

                if bool(os.environ.get('USE_LOCAL')):
                    plot_link = f'http://localhost:4566/plots/{request_id}.png'
                else:
                    bucket_location = boto3.client('s3').get_bucket_location(Bucket=os.getenv('S3_BUCKET'))                 
                    plot_link = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                        bucket_location['LocationConstraint'],
                        os.getenv('S3_BUCKET'),
                        f'{request_id}.png'
                    )

        stat =  'UNKNOWN_ERROR'
        if plot_link == 'MERRA-LINK-NOT-FOUND':
            stat =  'DATA_RETRIEVAL_FAILURE'
        elif plot_link == '' or  plot_link == None:
            stat = 'IMAGE_PARSING_FAILURE'
        else:
            stat = 'SUCCESS'
        db['plots'].insert_one({
            'plot_link': '' if not plot_link else plot_link,
            'target_link': target_link,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'request_id': request_id,
            'status': stat,
            'original_request': original_request
        })          
        return {
            "message": "Success"
        }
    except Exception as err:
        db['plots'].insert_one({
            'plot_link': 'NEXRAD-S3-LINK-NOT-FOUND',
            'user_id': user_id,
            'target_link': target_link,
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

@plot_api.route('/v1/plots', methods=["POST"])
def create_plot():
    """
    Used to create an plot and store its s3 link
    @params - A POST request sent to the plot service to create a plot of weather data
    @return - json of the created plot image s3 link
    """
    request_data = request.get_json()
    type = request_data.get("type")
    context_switcher = {
            'nexrad': nexrad,
            'merra': merra
        }
    try:
        plotresponse = context_switcher.get(type)(request_data)
        return plotresponse
    except Exception as err:
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

