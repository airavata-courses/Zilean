import uuid
from django.shortcuts import render
from django.conf import settings


# for calling plotting microservice
import requests
from bson import json_util
import json
from .kafka_producer import kafka_producer
# For downloading the NEXRAD data
import nexradaws
from datetime import datetime
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import db
import uuid
from datetime import datetime

class RetriveData(APIView):
    def post(self,request):
        try:
            date = request.data.get("date")
            time = request.data.get("time")
            station = request.data.get("station")
            user_id = request.data.get("user_id")
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
                        "user_id": str(user_id)
                    }, default=json_util.default).encode('utf-8'))
                return Response({"message":"Success"},status=status.HTTP_200_OK)
        except Exception as err:
            return Response({"message":err},status=status.HTTP_400_BAD_REQUEST)