from django.shortcuts import render, redirect
from accounts.models import Account
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils import timezone
from django.conf import settings
from .backend import EmailBackend
from django.contrib.auth import login as auth_login, logout  
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializer import AccountSerializer, SignUpSerializer, LoginSerializer, ChangeUsernameSerializer, ChangeEmailSerializer
from .EmailService import EmailService

# Create your views here.

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = Account.objects.create_user(
                email=serializer.validated_data['email'],
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password1']
            )
            email_service = EmailService() # Dont trust it
            email_service.send_verification_email(user)
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print("user is logged in")
            user = serializer.validated_data['user']
            auth_login(request, user, backend='accounts.backend.EmailBackend')
            print("user authenticated: ", request.user.is_authenticated)
            return Response(AccountSerializer(user).data)
        else:
            print("user is not logged in")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        print(f"Verification attempt with uidb64: {uidb64}, token: {token}")
    
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Account.objects.get(pk=uid)
            print(f"Found user: {user.email}")

        except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
            user = None

        if user is not None:
            is_valid = default_token_generator.check_token(user, token)
            print(f"Token valid: {is_valid}")  # Debug token validation
            
            if is_valid:
                print(f"Activating user: {user.email}")  # Debug activation
                user.is_active = True
                user.save()
                return Response({'success': True})
            return Response({'error': 'Invalid verification link'}, 
                       status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        logout(request)
        return Response({'success': True})

class ChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeUsernameSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.username = serializer.validated_data['username']
            user.save()
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_email = serializer.validated_data['email']

            user.pending_email = new_email
            user.save()
            
            email_service = EmailService()
            email_service.send_change_email_verification_email(user)
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyNewEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Account.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
            user = None

        if user is not None:
            is_valid = default_token_generator.check_token(user, token)
            if is_valid:
                user.email = user.pending_email
                user.pending_email = None
                user.email_verification_token = None
                user.email_token_created = None
                user.save()
                return Response({'success': True})
            return Response({'error': 'Invalid verification link'}, 
                       status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Invalid verification link'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
def verify_user(user):
    user.is_active = False
    user.save()
    
    email_service = EmailService()
    email_service.send_verification_email(user)
    return JsonResponse({'success': True})