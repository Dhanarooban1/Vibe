import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../Config';

const BookingPage = () => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [parkingNumber, setParkingNumber] = useState('');
  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
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
        const response = await axios.get(`${BASE_URL}/api/parking-slots/available/?date=${date}&time_slot=${timeSlot}`);
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

  // Get all users from the company
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/`);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !timeSlot || !parkingNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (!bookingForSelf && !selectedUser) {
      setError('Please select a user to book for');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/bookings/`, {
        booking_date: date,
        time_slot: timeSlot,
        parking_slot: parkingNumber,
        booked_for: bookingForSelf ? null : selectedUser
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Book a Parking Slot</h2>
          <p className="text-center text-gray-500 mb-8">Reserve your parking space with ease</p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                   onClick={() => setBookingForSelf(true)}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${bookingForSelf ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                  {bookingForSelf && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`${bookingForSelf ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>Book for myself</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                   onClick={() => setBookingForSelf(false)}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${!bookingForSelf ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                  {!bookingForSelf && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`${!bookingForSelf ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>Book for others</span>
              </div>
            </div>
            
            {!bookingForSelf && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="user">
                  Select Employee
                </label>
                <div className="relative">
                  <select
                    id="user"
                    className="appearance-none block w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required={!bookingForSelf}
                  >
                    <option value="">Choose an employee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || `${user.first_name} ${user.last_name}`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                  Select Date
                </label>
                <input
                  id="date"
                  type="date"
                  min={today}
                  className="appearance-none block w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="timeSlot">
                  Select Time Slot
                </label>
                <div className="relative">
                  <select
                    id="timeSlot"
                    className="appearance-none block w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="parkingNumber">
                Parking Slot
              </label>
              <div className="relative">
                <select
                  id="parkingNumber"
                  className="appearance-none block w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {date && timeSlot && availableSlots.length === 0 && !loading && (
                <p className="text-red-500 text-sm mt-2">No parking slots available for this time</p>
              )}
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;