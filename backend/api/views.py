from allauth.socialaccount.models import SocialAccount, SocialLogin
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .serializers import UserSerializer,EmailSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import EmailVerificationToken
import requests
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes,force_str
from django.urls import reverse
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from urllib.parse import unquote
from django.contrib.auth import get_user_model
from allauth.socialaccount.helpers import complete_social_login
from django.http import JsonResponse
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
import os
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings


User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        print("Received request data:", request.data)  # Debugging line

        code = request.data.get("code")
        print("Authorization code:", code)
        
        if code:
            nawcode = unquote(code)
        else:
            return Response({'message': 'Authorization code not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        print("Decoded authorization code:", nawcode)
        
        token_url = "https://oauth2.googleapis.com/token"
        token_args = {
            "code": nawcode,
            "client_secret": "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",
            "client_id": "58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com",
            "redirect_uri": "http://localhost:5173/google",  # Ensure this matches the one used during authorization
            "grant_type": "authorization_code",
        }

        try:
            token_response = requests.post(token_url, data=token_args)
            print("Token response status code:", token_response.status_code)
            print("Token response text:", token_response.text)
            
            token_response.raise_for_status()  # Ensure the request was successful
            token_data = token_response.json()
            
            # Accessing keys in the response
            print("Token response JSON:", token_data)
            access_token = token_data.get('access_token')
            id_token = token_data.get('id_token')
            refresh_token = token_data.get('refresh_token')
            if not access_token or not refresh_token:
                raise KeyError("Access or refresh token not found in the response")
            
            headers = {"Authorization": f"Bearer {access_token}"}
            print("Headers:", headers)

            info_response = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers=headers)
            print("User info response status code:", info_response.status_code)
            print("User info response text:", info_response.text)
            info_response.raise_for_status()  # Ensure the request was successful
            info_data = info_response.json()
            email = info_data.get("email")
            first_name = info_data.get("given_name")
            last_name = info_data.get("family_name")
            print("Email:", email)

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )

            if created:
                user.set_unusable_password()
                user.save()

            social_account, social_account_created = SocialAccount.objects.get_or_create(
                user=user,
                provider='google',
                uid=info_data.get('id'),
                defaults={'extra_data': info_data}
            )

            if social_account_created:
                social_login = SocialLogin(user=user, account=social_account)
                complete_social_login(request, social_login)

            return Response({
                'message': 'Token exchange successful',
                'email': email,
                'access': id_token,
                'refresh': refresh_token,
            }, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            print("RequestException:", str(e))
            return Response({'message': 'Token exchange failed'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            print("KeyError:", str(e))
            return Response({'message': 'Token exchange failed: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GoogleTokenRefreshView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token")
        print(refresh_token)
        client_id = "58202102051-2jc74gul47eg8j9kjtv47hsfhn9ddppv.apps.googleusercontent.com"
        client_secret = "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"
        
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }

        try:
            response = requests.post(token_url, data=token_data)
            response.raise_for_status()
            token_data = response.json()
            return JsonResponse(token_data)
        except requests.RequestException as e:
            return JsonResponse({"error": str(e)}, status=400)
        
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        if not token:
            return Response({'message': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the token with Google and get user info
        try:
            user_info_url = "https://oauth2.googleapis.com/tokeninfo"
            params = {'id_token': token}
            user_info_response = requests.get(user_info_url, params=params)
            user_info_response.raise_for_status()
            user_info = user_info_response.json()

            email = user_info.get("email")
            first_name = user_info.get("given_name")
            last_name = user_info.get("family_name")

            if not email:
                return Response({'message': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )

            if created:
                user.set_unusable_password()
                user.save()

            social_account, social_account_created = SocialAccount.objects.get_or_create(
                user=user,
                provider='google',
                uid=user_info.get('sub'),
                defaults={'extra_data': user_info}
            )

            if social_account_created:
               print("crattt")
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            print(access_token)
            return Response({
                'message': 'Login successful',
                'email': email,
                'access_token': access_token,
                'refresh_token': refresh_token,
            }, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({'message': 'Token verification failed'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({'message': f'Token verification failed: {e}'}, status=status.HTTP_400_BAD_REQUEST)
        




@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    encoded_pk = request.data.get('encoded_pk')
    token = request.data.get('token')
    new_password = request.data.get('password')

    if not encoded_pk or not token or not new_password:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_pk = force_str(urlsafe_base64_decode(encoded_pk))
        user = User.objects.get(pk=user_pk)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and PasswordResetTokenGenerator().check_token(user, token):
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid token or user"}, status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(generics.GenericAPIView):
    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        
        if user:
            print("hda email :",os.getenv("EMAIL_HOST_USER"))
            encoded_pk = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_url = reverse("reset_password", kwargs={"encoded_pk": encoded_pk, "token": token})
            reset_url = f"http://localhost:5173{reset_url}"  # Use your actual domain

            # Send the email to the user's email address
            subject = 'Password Reset'
            message = f'Click the link below to reset your password:\n{reset_url}'
            from_email = os.getenv("EMAIL_HOST_USER")
            recipient_list = [user.email]
            send_mail(subject, message, from_email, recipient_list)

        # Always return the same response to avoid disclosing user existence
        return Response(
            {"message": "If an account with this email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK
        )
    
class VerifyEmail(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        token = request.query_params.get('token')
        token_obj = get_object_or_404(EmailVerificationToken, token=token)
        user = token_obj.user
        user.email_verified = True
        user.save()
        token_obj.delete()
        return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
    
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.parsers import JSONParser, FormParser

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user

        if not user.email_verified:
            token = EmailVerificationToken.objects.create(user=user)
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{token.token}"
            
            send_mail(
                'Verify your email',
                f'Click the following link to verify your email: {verification_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email]
            )
            return Response({'detail': 'User account is not active'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
