import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import BookingPage from './components/parking/BookParking';
import MyBookingsPage from './components/parking/ViewBookings';
import axios from 'axios';
import Cookies from 'js-cookie';

// Set up axios interceptor for authentication
axios.interceptors.request.use(
  config => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Protected route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!Cookies.get('access_token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/booking" 
          element={<ProtectedRoute element={<BookingPage />} />} 
        />
        <Route 
          path="/my-bookings" 
          element={<ProtectedRoute element={<MyBookingsPage />} />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;