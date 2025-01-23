from django.contrib import admin
from django.urls import path
from .views import SignUpView, LoginView, VerifyEmailView, LogoutView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
]
