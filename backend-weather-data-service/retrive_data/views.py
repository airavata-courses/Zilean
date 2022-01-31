from ast import Try
import imp


# from resource import prlimit
from turtle import pd
import uuid
from django.shortcuts import render
from django.conf import settings

# for calling plotting microservice
import requests


# For downloading the NEXRAD data
import nexradaws
from datetime import datetime
from datetime import timedelta
import tempfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import db
import uuid
from datetime import datetime

# Create your views here.

class RetriveData(APIView):
    def get(self,request):
        try:
            date = request.data.get("date")
            time = request.data.get("time")
            station = request.data.get("station")
            user_id = request.data.get("user_id")
            temp=date.split("-")
            year,month,day=temp[0],temp[1],temp[2]
            temp=time.split(":")
            hh,mm=temp[0],temp[1]
            time_str=str(day)+'/'+str(month)+'/'+str(year)+' '+str(hh)+':'+str(mm)+':'+str(0.0)
            date_format_str = '%d/%m/%Y %H:%M:%S.%f'
            given_timestamp=datetime.strptime(time_str, date_format_str)
            
            start_time=given_timestamp-timedelta(minutes=5)
            end_time=given_timestamp+timedelta(minutes=5)
            conn = nexradaws.NexradAwsInterface()
            # templocation = tempfile.mkdtemp()
            try:
                availscans = conn.get_avail_scans_in_range(start_time,end_time,station)
                # results = conn.download(availscans[0],templocation)
                s3_bucket_link='https://s3.amazonaws.com/noaa-nexrad-level2/'
                collection = db['requests']
               
                url=s3_bucket_link+availscans[0].key
                # print(url)
                # import pdb
                # pdb.set_trace()
                collection.insert_one({
                    's3_link': url,
                    'user_id': user_id,
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow(),
                    'uuid': str(uuid.uuid4())
                })

                return Response({"message":"Success"},status=status.HTTP_200_OK)
            except Exception as err:
                return Response({"message":err},status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            # print("Except block")
            return Response({"message":err},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        


