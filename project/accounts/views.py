from django.shortcuts import render
from accounts.forms import SignUpForm, LoginForm
from accounts.models import Account

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            print("User created")
            return render(request, 'accounts/login.html')
        else:
            print("Form is not valid")
            print(form.errors)
            return render(request, 'accounts/signup.html', {'form': form})
    return render(request, 'accounts/signup.html')

def login(request):
    print('login')
    return render(request, 'accounts/login.html')