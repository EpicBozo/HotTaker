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
from django.contrib.auth import login as auth_login  # Add this import
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializer import AccountSerializer, SignUpSerializer

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
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Please provide both email and password'},
                          status=status.HTTP_400_BAD_REQUEST)

        backend = EmailBackend()
        user = backend.authenticate(request, email=email, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'},
                          status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Account is not active'},
                          status=status.HTTP_401_UNAUTHORIZED)

        auth_login(request, user)
        serializer = AccountSerializer(user)
        return Response(serializer.data)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Account.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'success': True})
        return Response({'error': 'Invalid verification link'}, 
                       status=status.HTTP_400_BAD_REQUEST)

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
    send_mail(subject, plain_message, from_email, [to], html_message=message)

