from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmailVerificationToken
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.core.mail import send_mail, BadHeaderError
import smtplib
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "password",]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        if not user.email:
            raise ValidationError("The provided email is invalid.")

        token = EmailVerificationToken.objects.create(user=user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{token.token}"

        try:
            send_mail(
                'Verify your email',
                f'Click the following link to verify your email: {verification_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email]
            )
        except smtplib.SMTPRecipientsRefused:
            raise ValidationError({"email": ["Failed to send verification email. The provided email address does not exist."]})
        except BadHeaderError:
            raise ValidationError({"email": ["Invalid header found."]})
        except Exception as e:

            raise ValidationError({"email": [f"Failed to send verification email: {str(e)}"]})
        user.save()

        return user
class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("There is no user registered with this email address.")
        return value


