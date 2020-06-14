from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
import base64


def api_login(request):
    user = None

    if "HTTP_AUTHORIZATION" in request.META:
        auth = request.META["HTTP_AUTHORIZATION"].split()
        if len(auth) == 2 and auth[0].lower() == "basic":
            auth_str = base64.b64decode(auth[1]).decode('utf-8')
            username, password = auth_str.split(":")
            user = authenticate(username=username, password=password)
    
    if user is None:
        data = {
                'status': 401,
                'error': 'Unauthorized'
                }
        response = JsonResponse(data)
        response.status_code = 401
        return response

    next_page = request.GET.get('next', None)
    if next_page is None:
        data = {
                'status': 400,
                'error': 'Direct access to this URL is not allowed'
                }
        response = JsonResponse(data)
        response.status_code = 400;
        return response
    login(request, user)
    return redirect(next_page)


# Log in using Django services
def web_login(request):
    if request.POST.get('submit', False):
        username = request.POST['username']
        password = request.POST['password']
        next = request.POST['next']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            if next:
                return redirect(next)
            else:
                return redirect('/')
        else:
            return render(request, 'facer/login.html',
                          {
                              'username': username,
                              'next': next,
                              'error': 'Неверное имя пользователя или пароль!'
                          })
    else:
        return render(request, 'facer/login.html', {'next': request.GET.get('next', '/')})
