from importlib.resources import path

from django.urls import path

from .views import RetriveData


urlpatterns=[
path('',RetriveData.as_view(),name='retrive-data')
]


