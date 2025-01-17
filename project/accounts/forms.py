from django import forms
from accounts.models import Account
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm

class SignUpForm(UserCreationForm):
    username = forms.CharField(max_length=50)
    email = forms.EmailField(max_length=50)

    class Meta:
        model = Account
        fields = ['username', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data['email']
        if Account.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists")
        return email
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if Account.objects.filter(username=username).exists():
            raise forms.ValidationError("Username already exists")
        return username
    
    def save(self, commit=True):
        user = Account.objects.create_user(
            username=self.cleaned_data['username'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password1']
        )

        return user

        
class LoginForm(forms.ModelForm):
    email = forms.EmailField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = Account
        fields = ['email', 'password']
        
    def clean_email(self):
        email = self.cleaned_data['email']
        if not Account.objects.filter(email=email).exists():
            raise forms.ValidationError("Email does not exist")
        return email
    
    def clean_password(self):
        email = self.cleaned_data['email']
        password = self.cleaned_data['password']
        user = Account.objects.get(email=email)
        login(self, user)
        if not user.check_password(password):
            raise forms.ValidationError("Password is incorrect")
        return password
