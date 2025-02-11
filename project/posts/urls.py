from django.urls import path
from .views import CreatePostView, ViewPostsView, FeedView

urlpatterns = [
    path('create-posts/', CreatePostView.as_view(), name = "create_post"),
    path('user-post/<int:post_id>/', ViewPostsView.as_view(), name = "user_post_detail"),
    path('feed/', FeedView.as_view(), name = "feed"),
]