from django.shortcuts import render, redirect
from accounts.forms import SignUpForm, LoginForm
from accounts.models import Account
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from .backend import EmailBackend
from django.contrib.auth import login as auth_login, logout  
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializer import AccountSerializer, SignUpSerializer, LoginSerializer

# Create your views here.

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = Account.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password1']
            )
            verify_user(user)
            return Response({'success': True}, status=status.HTTP_201_CREATED)
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

def verify_user(user):
    user.is_active = False
    user.save()

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Use the dedicated FRONTEND_URL setting
    verification_link = f"{settings.FRONTEND_URL}/verify/{uid}/{token}"
    print(verification_link)
    send_verification_email(user.email, verification_link)

def send_verification_email(email, verification_link):
    subject = 'Verify your email'
    message = render_to_string('accounts/verify_email.html', {'link': verification_link})
    from_email = settings.EMAIL_HOST_USER
    to = email

    plain_message = strip_tags(message)
    send_mail(subject, plain_message, from_email, [to], html_message=message)
