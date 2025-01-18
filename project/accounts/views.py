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

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            print("Form is valid")
            verify(form)
            return redirect('login')
        else:
            print("Form is not valid")
            print(form.errors)
            return render(request, 'accounts/signup.html', {'form': form})
    return render(request, 'accounts/signup.html')

def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            auth_login(request, user)
            return redirect('signup')
        return render(request, 'accounts/login.html', {'form': form})
    form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

def verify(form):
    user = form.save(commit=False)
    user.is_active = False
    user.save()

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    verification_link = f"{settings.DOMAIN}/accounts/verify/{uid}/{token}"
    send_verification_email(user.email, verification_link)

def send_verification_email(email, verification_link):
    subject = 'Verify your email'
    message = render_to_string('accounts/verify_email.html', {'link': verification_link})
    from_email = settings.EMAIL_HOST_USER
    to = email

    send_mail(subject, message, from_email, [to])

def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'accounts/verification_success.html')
    return render(request, 'accounts/verification_failed.html')
