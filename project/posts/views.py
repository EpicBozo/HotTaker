from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import PostSerializer

# Create your views here.

class CreatePostView(APIView):
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data)
        return Response(serializer.errors)
    
    
