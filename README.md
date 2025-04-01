# Parking Management System

A full-stack web application for managing parking slot bookings. The system allows users to book parking spaces, view their bookings, and cancel bookings when needed.

## Features
- User authentication (login) 
  - Demo credentials: Name: admin, password: 123456
- Book available parking slots
- Cancel existing bookings
- Real-time availability check based on date and time
- Book for others

## Demo
[Watch the demo video](YOUR_VIDEO_URL_HERE) showcasing:
- The login process
- How to book a parking slot
- Checking availability
- Canceling bookings


## Deployment

### Backend Deployment (Render.com)
The backend is currently deployed on Render.com at: https://vibe-r6o7.onrender.com

### Frontend Deployment (Vercel)
The frontend is currently deployed on Vercel at: https://vibe-6ewf.vercel.app

## Tech Stack

### Backend
- Framework: Django with Django REST Framework
- Database: SQLite (development)
- Authentication: Token-based authentication
- Deployment: Render.com

### Frontend
- Framework: React with Vite
- Routing: React Router v6
- Styling: Tailwind CSS
- HTTP Client: Axios
- State Management: React Hooks (useState, useEffect)
- Deployment: Vercel

## Project Structure

The project is organized into two main directories:

### Backend
```
Backend/
├── backend/
    ├── api/               # Django app for REST API
    ├── backend/           # Django project settings
    ├── manage.py
```

### Frontend
```
Frontend/
├── app/
    ├── public/            # Static assets
    ├── src/
        ├── assets/        # Images and other assets
        ├── components/    # React components
            ├── auth/      # Authentication components
            ├── parking/   # Parking-related components
        ├── App.jsx        # Main app component
        ├── Config.js      # Configuration and constants
        ├── main.jsx       # Entry point
    ├── index.html         # HTML template
    ├── vite.config.js     # Vite configuration
```

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python (3.8 or higher)
- pip

### Backend Setup
1. Navigate to the backend directory:
```
cd Backend/backend
```

2. Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run migrations:
```
python manage.py migrate
```

5. Create a superuser:
```
python manage.py createsuperuser
```

6. Start the development server:
```
python manage.py runserver
```

### Frontend Setup
1. Navigate to the frontend directory:
```
cd Frontend/app
```

2. Install dependencies:
```
npm install
```

3. Create a .env file with the backend API URL:
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```
npm run dev
```



## API Endpoints

### Authentication
- POST /api/login/ - User login, returns an authentication token

### Parking Slots
- GET /api/parking-slots/available/ - Get available parking slots by date and time

### Bookings
- GET /api/bookings/ - List all bookings for the authenticated user
- POST /api/bookings/ - Create a new booking
- PATCH /api/bookings/{id}/ - Update a booking (e.g., cancel)

