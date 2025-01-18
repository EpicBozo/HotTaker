from django import forms
from accounts.models import Account
from django.contrib.auth import login, authenticate
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
        
    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')

        print(email, password)
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not Account.objects.filter(email=email).exists():
                print("Debug: Email does not exist in the database")
                raise forms.ValidationError("Email does not exist")
            if user is None:
                print("Debug: Authentication failed, invalid email or password")
                raise forms.ValidationError("Invalid email or password")
            if user.check_password(password) is False:
                print("Debug: Authentication failed, invalid email or password")
                raise forms.ValidationError("Wrong password")
            else:
                print("Debug: Authentication successful")
        else:
            print("Debug: Email and password are required")
            raise forms.ValidationError("Email and password are required")
        return cleaned_data

