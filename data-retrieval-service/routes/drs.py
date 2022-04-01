from flask import Blueprint, request
import os
import json
from db.models import db
from datetime import datetime
from bson import json_util
import uuid
import nexradaws
from datetime import timedelta
import requests

from utils.kafka_producer import kafka_producer

drs_api = Blueprint('drs_api', __name__)
def nexrad(request_data):
    type = request_data.get("type")
    date = request_data.get("date")
    time = request_data.get("time")
    station = request_data.get("station")
    user_id = request_data.get("user_id")
    year, month, day = date.split("-")
    hh, mm = time.split(":")
    time_str = str(day)+'/'+str(month)+'/'+str(year)+' '+str(hh)+':'+str(mm)+':'+str(0.0)
    date_format_str = '%d/%m/%Y %H:%M:%S.%f'
    given_timestamp = datetime.strptime(time_str, date_format_str)
    start_time, end_time =given_timestamp-timedelta(minutes=5), given_timestamp+timedelta(minutes=5)
    conn = nexradaws.NexradAwsInterface()
    try:
        availscans = conn.get_avail_scans_in_range(start_time,end_time,station)
        url= 'https://s3.amazonaws.com/noaa-nexrad-level2/' + availscans[0].key
    except Exception as e:
        url= 'NEXRAD-S3-LINK-NOT-FOUND'
    finally:
        original_request={
            "date": date,
            "time": time,
            "station": station,
            "type":type
            }
        request_uuid = str(uuid.uuid4())
        db['requests'].insert_one({
                's3_link': url,
                'user_id': user_id,
                'type':type,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'uuid': request_uuid
            })
        kafka_producer.send(
            'plot-queue', 
            json.dumps({
                "request_id": request_uuid,
                "s3_link": url,
                "type":type,
                "user_id": str(user_id),
                "original_request": original_request,
            }, default=json_util.default).encode('utf-8'))
        return {
            "message": "Success"
        }
def merra(request_data):
    date = request_data.get("date")
    hour = request_data.get("hour")
    type = request_data.get("type")
    user_id = request_data.get("user_id")
    year, month, day = date.split("-")
    urlpart1 = "https://goldsmr4.gesdisc.eosdis.nasa.gov/data/MERRA2/M2I1NXLFO.5.12.4/"
    urlpart2 = year+"/"+month+"/"+"MERRA2_400.inst1_2d_lfo_Nx."+year+month+day+".nc4"
    URL = urlpart1 + urlpart2
    result = requests.get(URL)
    try:
        result.raise_for_status()
    except:
        print('requests.get() returned an error code '+str(result.status_code))
    finally:
        original_request={
            "date": date,
            "type":type,
            "hour": hour
        }
        request_uuid = str(uuid.uuid4())
        db['requests'].insert_one({
            'url': URL,
            'user_id': user_id,
            'type':type,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'uuid': request_uuid
            })
        kafka_producer.send(
            'plot-queue', 
            json.dumps({
                "request_id": request_uuid,
                "url": URL,
                "type":type,
                "user_id": str(user_id),
                "original_request": original_request,
                }, default=json_util.default).encode('utf-8'))
        return {
            "message": "Success"
        }
@drs_api.route('/v1/retrieve-data', methods=["POST"])
def retrieve_data():
    """
    Used to retrieve data and save in database
    @params - A POST request sent to the retrieve weather data
    @return - success json
    """
    request_data = json.loads(request.data)
    type = request_data.get("type")
    context_switcher = {
            'nexrad': nexrad,
            'merra': merra
        }
    try:
        drsmessage = context_switcher.get(type)(request_data)
        return drsmessage
    except Exception as err:
        print(err)
        return {
            "message": str(err)
        }


