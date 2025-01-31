from django.urls import path
from .views import CreatePostView, ViewPostsView, FeedView, GetUserPosts

urlpatterns = [
    path('create-posts/', CreatePostView.as_view(), name = "create_post"),
    path('posts/<int:post_id>/', ViewPostsView.as_view(), name = "user_post_detail"),
    path('feed/', FeedView.as_view(), name = "feed"),
    path('<str:username>/', GetUserPosts.as_view(), name = "user_posts"),
]