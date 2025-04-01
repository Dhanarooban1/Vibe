from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ParkingSlot, Booking
from .serializers import ParkingSlotSerializer, BookingSerializer
from datetime import datetime

class ParkingSlotViewSet(ModelViewSet):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        date_str = request.query_params.get('date')
        time_slot = request.query_params.get('time_slot')
        
        if not date_str or not time_slot:
            return Response({"error": "Date and time_slot are required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse the date string to ensure it's valid
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Find all booked slots for this date and time
            booked_slots = Booking.objects.filter(
                booking_date=booking_date,
                time_slot=time_slot,
                status='booked'
            ).values_list('parking_slot_id', flat=True)
            
            # Find all available slots
            available_slots = ParkingSlot.objects.exclude(id__in=booked_slots)
            serializer = self.get_serializer(available_slots, many=True)
            
            return Response(serializer.data)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, 
                          status=status.HTTP_400_BAD_REQUEST)

class BookingViewSet(ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only show user's own bookings
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if slot is already booked for this date and time
        parking_slot = serializer.validated_data.get('parking_slot')
        booking_date = serializer.validated_data.get('booking_date')
        time_slot = serializer.validated_data.get('time_slot')
        
        existing_booking = Booking.objects.filter(
            parking_slot=parking_slot,
            booking_date=booking_date,
            time_slot=time_slot,
            status='booked'
        ).exists()
        
        if existing_booking:
            return Response(
                {"error": "This parking slot is already booked for the selected date and time."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the booking with the current user
        serializer.save(user=self.request.user)