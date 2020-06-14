from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.generic import DetailView
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.contrib.auth import logout
from weather.models import History
from weather.views.utils import lat_lon_validator
import requests
import json


#@login_required
def get_weather(request, latitude, longitude):
    valid, response = lat_lon_validator(latitude, longitude)
    if not valid:
        return response

    key = settings.OPEN_WEATHER_API_KEY
    url = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={key}'
    response = requests.get(url.format(lat = latitude, lon = longitude, key = key))
    data = json.loads(response.content)

    to_hist = History(latitude = latitude, longitude = longitude, result = data)
    to_hist.save()

    request.session.flush()
    return JsonResponse(data)

