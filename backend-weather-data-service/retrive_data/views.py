from ast import Try
import re
# from resource import prlimit
from turtle import pd
from django.shortcuts import render
from django.conf import settings

# For downloading the NEXRAD data
import nexradaws
from datetime import datetime
from datetime import timedelta
import tempfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class RetriveData(APIView):
    def get(self,request):
        try:
            
            date = request.data.get("date")
            time = request.data.get("time")
            station = request.data.get("station")
           
            # print(date,time,station)
            temp=date.split("-")
            year,month,day=temp[0],temp[1],temp[2]
            temp=time.split(":")
            hh,mm=temp[0],temp[1]
            
            time_str=str(day)+'/'+str(month)+'/'+str(year)+' '+str(hh)+':'+str(mm)+':'+str(0.0)
            date_format_str = '%d/%m/%Y %H:%M:%S.%f'
            given_time=datetime.strptime(time_str, date_format_str)

            start_time=given_time-timedelta(minutes=5)
            end_time=given_time+timedelta(minutes=5)

            conn = nexradaws.NexradAwsInterface()
            templocation = tempfile.mkdtemp()

            availscans = conn.get_avail_scans_in_range(start_time,end_time,station)
           
            results = conn.download(availscans[0],templocation)
            print(settings.BASE_DIR)
            # import pdb
            # pdb.set_trace()

            return Response({"message":"Success"},status=status.HTTP_200_OK)
        except:
            return Response({"message":"Something went wrong"},status=status.HTTP_404_NOT_FOUND)

        


