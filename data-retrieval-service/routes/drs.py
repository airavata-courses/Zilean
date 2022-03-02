from flask import Blueprint, request
import os
import json
from db.models import db
from datetime import datetime
from bson import json_util
import uuid
import nexradaws
from datetime import timedelta
from utils.kafka_producer import kafka_producer

drs_api = Blueprint('drs_api', __name__)


@drs_api.route('/v1/retrieve-data', methods=["POST"])
def retrieve_data():
    """
    Used to retrieve data and save in database
    @params - A POST request sent to the retrieve weather data
    @return - success json
    """
    try:
        request_data = json.loads(request.data)
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
            }
            request_uuid = str(uuid.uuid4())
            db['requests'].insert_one({
                's3_link': url,
                'user_id': user_id,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'uuid': request_uuid
            })
            kafka_producer.send(
                'plot-queue', 
                json.dumps({
                    "request_id": request_uuid,
                    "s3_link": url,
                    "user_id": str(user_id),
                    "original_request": original_request,
                }, default=json_util.default).encode('utf-8'))
            return {
                "message": "Success"
            }
    except Exception as err:
        print(err)
        return {
            "message": str(err)
        }