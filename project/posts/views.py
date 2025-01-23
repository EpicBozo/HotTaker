from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializer import PostSerializer

# Create your views here.
def post(self, request):
    permission_classes = [IsAuthenticated]

    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data)
    return Response(serializer.errors)
    
    
