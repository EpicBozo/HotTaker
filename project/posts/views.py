from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializer import PostSerializer 
from accounts.serializer import AccountSerializer
from accounts.models import Account
from .models import Post

# Create your views here.
class CreatePostView(APIView):
    print("Function post called")
    permission_classes = [IsAuthenticated]
    print("Allow any")
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response({'success': True, 'post':serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ViewPostsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, post_id):
        posts = Post.objects.get(id=post_id)
        serializer = PostSerializer(posts)
        return Response(serializer.data)
    
class FeedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class GetUserPosts(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):

        #Gets posts
        try:
            posts = Post.objects.filter(author__username=username)
            serializer = PostSerializer(posts, many=True)
            
            #Get account details
            account = Account.objects.get(username=username)
            account_serializer = AccountSerializer(account)
            
            return Response({
                'posts': serializer.data,
                'account': account_serializer.data
            })
        except Account.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
