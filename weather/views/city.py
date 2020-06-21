from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic import View
from django.shortcuts import get_object_or_404
from weather.models import City
from weather.views.utils import lat_lon_validator
import json


@method_decorator(csrf_exempt, name='dispatch')
class CityCommonView(View):
    def get(self, request):
        objects = City.objects.all()
        data = []
        for obj in objects:
            data.append({
                'id': obj.id,
                'name': obj.name,
                'country': obj.country,
                'latitude': obj.latitude,
                'longitude': obj.longitude,
            })
    
        response_data = {
            'status': 200,
            'num': len(data),
            'data': data
        }
        return JsonResponse(response_data)


class CityView(View):
    def get(self, request, city_id):
        city = get_object_or_404(City, id = city_id)
        data = {
            'id': city.id,
            'name': city.name,
            'country': city.country,
            'latitude': city.latitude,
            'longitude': city.longitude,
        }
    
        response_data = {
            'status': 200,
            'num': len(data),
            'data': data
        }
        return JsonResponse(response_data)
