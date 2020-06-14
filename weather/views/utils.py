from django.http import JsonResponse, HttpResponse


def lat_lon_validator(latitude, longitude):
    try:
        lat = float(latitude)
        lon = float(longitude)
    except ValueError:
        data = {
                'status': 400,
                'error': 'Latitude and longitude should be float'
                }
        response = JsonResponse(data)
        response.status_code = 400;
        return False, response

    if lat > 90 or lat < -90:
        data = {
                'status': 400,
                'error': 'Latitude should be between -90 and 90'
                }
        response = JsonResponse(data)
        response.status_code = 400;
        return False, response

    if lon > 180 or lon < -180:
        data = {
                'status': 400,
                'error': 'Longitude should be between -90 and 90'
                }
        response = JsonResponse(data)
        response.status_code = 400;
        return False, response

    return True, None
