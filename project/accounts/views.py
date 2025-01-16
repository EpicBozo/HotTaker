from django.shortcuts import render

# Create your views here.

def signup(request):
    print('signup')
    return render(request, 'signup.html')

def login(request):
    print('login')
    return render(request, 'login.html')