from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic import View
import base64, json


@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
    def get(self, request):
        print (request.user.is_authenticated)
        print (request.user)
        if request.user.is_authenticated:
            data = {
                'status': 200,
                'error': 'OK'
            }
        else:
            data = {
                'status': 401,
                'error': 'Unauthorized'
            }
        response = JsonResponse(data)
        return response

    def post(self, request):
        print (request.user.is_authenticated)
        print (request.user)
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username', None)
        password = data.get('password', None)
        user = None

        if username is not None and password is not None:
            user = authenticate(username=username, password=password)

        logout(request)

        if user is None:
            data = {
                    'status': 401,
                    'error': 'Unauthorized'
                    }
            response = JsonResponse(data)
#            response.status_code = 401
            return response

        login(request, user)
        print (request.user.is_authenticated)
        print (request.user)
        data = { 'status': 200 }
        return JsonResponse(data)
