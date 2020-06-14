from django.db import models
from weather.validators import validate_latitude, validate_longitude

class City(models.Model):
    name = models.CharField(max_length = 128)
    country = models.CharField(max_length = 128)
    latitude = models.DecimalField(max_digits=6, decimal_places=4, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=7, decimal_places=4, validators=[validate_longitude])

    class Meta:
        unique_together = ['name', 'latitude', 'longitude']


class History(models.Model):
    latitude = models.DecimalField(max_digits=6, decimal_places=4, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=7, decimal_places=4, validators=[validate_longitude])
    result = models.TextField()
    time_stamp = models.DateTimeField(auto_now_add=True)
