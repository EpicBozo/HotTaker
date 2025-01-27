from django.urls import path
from .views import CreatePostView, ViewPostsView

urlpatterns = [
    path('create-posts/', CreatePostView.as_view(), name = "create_post"),
    path('user-posts/', ViewPostsView.as_view(), name = "user_posts"),
]