from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.generic import DetailView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.generic import View
from weather.models import History
import requests
import json


class HistoryView(View):
    def get(self, request, num):
        try:
            num = int(num)
        except ValueError:
            data = {
                    'status': 400,
                    'error': 'Number should be integer'
                    }
            response = JsonResponse(data)
            response.status_code = 400
            return response

        objects = History.objects.all().order_by('-pk')[:num]
        data = []
        for obj in objects:
            data.append({
                'latitude': obj.latitude,
                'longitude': obj.longitude,
                'result': obj.result,
                'time_stamp': obj.time_stamp,
            })

        response_data = {
            'status': 200,
            'num': len(data),
            'data': data
        }
        return JsonResponse(response_data)

