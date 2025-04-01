# parking/models.py
from django.db import models
from django.contrib.auth.models import User

class ParkingSlot(models.Model):
    PARKING_TYPE_CHOICES = [
        ('regular', 'Regular'),
        ('premium', 'Premium'),
        ('disabled', 'Disabled'),
        ('electric', 'Electric Charging'),
    ]
    
    number = models.CharField(max_length=10,unique=True)  # P1, P2, P3, etc.
    parking_type = models.CharField(max_length=20, choices=PARKING_TYPE_CHOICES)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.number} ({self.get_parking_type_display()})"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parking_slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE)
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=20)  # e.g. "9:00AM - 11:00AM"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Booking by {self.user.username} for {self.parking_slot.number} on {self.booking_date}"