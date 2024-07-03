from django.contrib import admin
from django.urls import path, include
from api.views import GoogleLogin,GoogleTokenRefreshView,CreateUserView,GoogleLoginView,CustomTokenObtainPairView


from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path("admin/", admin.site.urls),
  
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
        path("api/token/google/refresh/", GoogleTokenRefreshView.as_view(), name="google-token-refresh"),

    path("api-auth/", include("rest_framework.urls")),
    path('api/google-login/', GoogleLoginView.as_view(), name='google-login'),

    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_logining'),
 path("api/", include("api.urls")),


]