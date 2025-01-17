from django.shortcuts import render, redirect
from accounts.forms import SignUpForm, LoginForm
from accounts.models import Account
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
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
            return redirect('home')
        else:
            print("Form is not valid")
            print(form.errors)
            return render(request, 'accounts/login.html', {'form': form})
    return render(request, 'accounts/login.html')

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

    return render(request, 'accounts/verify_email.html')
