from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    def get_author(self, obj):
        return obj.author.username
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'author', 'created_at', 'image']

    

    