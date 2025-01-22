from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import logout

# Create your views here.
def index(request):
    return render(request, 'main/index.html')

@api_view(['GET'])
def check_auth(request):
    import logging
    logger = logging.getLogger(__name__)
    logger.info("Session ID: %s", request.session.session_key)
    logger.info("User authenticated: %s", request.user.is_authenticated)
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'pfp': request.user.pfp.url,
                'status': getattr(request.user, 'status', None),
                'bio': getattr(request.user, 'bio', ''),
            }
        })
    return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
    logout(request)
    return HttpResponse('{"success": true}', content_type='application/json')