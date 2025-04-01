from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views as auth_views
from . import views

router = routers.DefaultRouter()
router.register(r'parking-slots', views.ParkingSlotViewSet)
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', auth_views.obtain_auth_token, name='login'),
]
