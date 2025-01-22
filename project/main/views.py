from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import logout

# Create your views here.
def index(request):
    return render(request, 'main/index.html')

@api_view(['GET'])
def check_auth(request):
    print("Session ID:", request.session.session_key)
    print("User authenticated:", request.user.is_authenticated)
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'pfp': request.user.pfp.url,
                'status': request.user.status,
                'bio': request.user.bio,
            }
        })
    return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
    logout(request)
    return Response({'success': True})