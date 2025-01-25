from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)  # Make author read-only
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'author', 'created_at']

    

    