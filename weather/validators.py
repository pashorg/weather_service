from django.core.exceptions import ValidationError

    
def validate_latitude(value):
    if (value > 90 or value < -90):
        raise ValidationError(
            'Latitude $(value)s should be ge -90 and le 90',
            params={'value': value},
        )

        
def validate_longitude(value):
    if (value > 180 or value < -180):
        raise ValidationError(
            'Longitude $(value)s should be ge -90 and le 90',
            params={'value': value},
        )
