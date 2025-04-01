// src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../Config';
const BookingPage = () => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [parkingNumber, setParkingNumber] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots] = useState([
    '9:00AM - 11:00AM',
    '11:00AM - 1:00PM',
    '1:00PM - 3:00PM',
    '3:00PM - 5:00PM',
    '5:00PM - 7:00PM'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get available slots based on selected date and time
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!date || !timeSlot) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`BASE_URL/api/parking-slots/available/?date=${date}&time_slot=${timeSlot}`);
        setAvailableSlots(response.data);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        setError('Failed to fetch available parking slots');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, timeSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !timeSlot || !parkingNumber) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/bookings/', {
        booking_date: date,
        time_slot: timeSlot,
        parking_slot: parkingNumber
      });
      
      // Redirect to display page after successful booking
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book a Parking Slot</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Select Date
              </label>
              <input
                id="date"
                type="date"
                min={today}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeSlot">
                Select Parking Slot Time
              </label>
              <select
                id="timeSlot"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parkingNumber">
                Parking Number
              </label>
              <select
                id="parkingNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={parkingNumber}
                onChange={(e) => setParkingNumber(e.target.value)}
                disabled={!date || !timeSlot || loading}
                required
              >
                <option value="">Select a parking slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.number} - {slot.parking_type}
                  </option>
                ))}
              </select>
              {date && timeSlot && availableSlots.length === 0 && !loading && (
                <p className="text-red-500 text-sm mt-1">No parking slots available for this time</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;