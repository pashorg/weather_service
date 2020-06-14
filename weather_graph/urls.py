"""weather_graph URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from weather import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.api_login, name='api_login'),
    path('api/weather/<latitude>/<longitude>/', views.get_weather, name='get_weather'),
    path('api/history/', views.get_history_default, name='get_history'),
    path('api/history/<num>/', views.get_history, name='get_history'),
    path('api/city/', views.CityCommonView.as_view(), name='cities'),
    re_path('api/city/(?P<city_id>\d+)/', views.CityView.as_view(), name='city'),
]
