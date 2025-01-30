from django.contrib import admin
from django.urls import path, include
from main import views
from accounts.views import LogoutView
from .views import CSRFTokenView
 

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/', include('accounts.urls')),
    path('api/auth/check', views.check_auth, name="check_auth"),
    path('api/logout/', LogoutView.as_view(), name="logout"),
    path('api/csrf/', CSRFTokenView.as_view(), name="csrf"),
    path('api/user-posts/', views.UserPostView.as_view(), name="posts"),
]
