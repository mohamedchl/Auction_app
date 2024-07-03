from django.urls import path
from api.views import reset_password, ResetPassword,VerifyEmail

urlpatterns = [
    path('reset-password/<str:encoded_pk>/<str:token>/', reset_password, name='reset_password'),
    path('reset-password-page/', reset_password, name='reset_password'),
    path('reset-password-sent/', ResetPassword.as_view(), name='reset_password_link'),
        path('verify-email/', VerifyEmail.as_view(), name='verify-email'),

]
