from django.contrib import admin
from django.urls import path, include
from main import views

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/', include('accounts.urls')),
    path('api/auth/check', views.check_auth, name="check_auth"),
    path('api/auth/logout', views.logout_view, name="logout")
]
