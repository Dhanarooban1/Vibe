# parking/serializers.py
from rest_framework import serializers
from .models import ParkingSlot, Booking
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ParkingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlot
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    parking_slot_details = ParkingSlotSerializer(source='parking_slot', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'user_details', 'parking_slot', 'parking_slot_details', 
                  'booking_date', 'time_slot', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'created_at']
    
    def validate(self, data):
        """
        Check if the parking slot is already booked for this date and time.
        """
        parking_slot = data.get('parking_slot')
        booking_date = data.get('booking_date')
        time_slot = data.get('time_slot')
        
        # Check for existing bookings
        if Booking.objects.filter(
            parking_slot=parking_slot,
            booking_date=booking_date,
            time_slot=time_slot,
            status='booked'
        ).exists():
            raise serializers.ValidationError("This parking slot is already booked for the selected date and time.")
        
        return data