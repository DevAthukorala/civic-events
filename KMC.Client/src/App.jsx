import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import EventSearch from './pages/EventSearch';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import MyRegistrations from './pages/MyRegistrations';

import './styles/index.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/search" element={<EventSearch />} />

                  {/* Organizer Protected Routes */}
                  <Route
                    path="/organizer/dashboard"
                    element={
                      <ProtectedRoute allowedRole="Organizer">
                        <OrganizerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events/new"
                    element={
                      <ProtectedRoute allowedRole="Organizer">
                        <CreateEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events/:id/edit"
                    element={
                      <ProtectedRoute allowedRole="Organizer">
                        <EditEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/my-events"
                    element={
                      <ProtectedRoute allowedRole="Organizer">
                        <MyEvents />
                      </ProtectedRoute>
                    }
                  />

                  {/* Participant Protected Routes */}
                  <Route
                    path="/participant/my-registrations"
                    element={
                      <ProtectedRoute allowedRole="Participant">
                        <MyRegistrations />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
