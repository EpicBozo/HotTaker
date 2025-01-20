from django.contrib import admin
from django.urls import path
from accounts import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('verify/<uidb64>/<token>/', views.verify_email, name='verify_email'),
]
