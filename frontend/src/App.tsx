import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import VerifyEmail from './pages/Auth/VerifyEmail';
import BugList from './pages/Bugs/BugList';
import BugDetails from './pages/Bugs/BugDetails';
import BugForm from './pages/Bugs/BugForm';
import ReusableFixes from './pages/ReusableFixes';
import Timeline from './pages/Timeline';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              <Route path="/bugs" element={
                <ProtectedRoute>
                  <BugList />
                </ProtectedRoute>
              } />
              
              <Route path="/bugs/new" element={
                <ProtectedRoute>
                  <BugForm />
                </ProtectedRoute>
              } />
              
              <Route path="/bugs/:id" element={
                <ProtectedRoute>
                  <BugDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/bugs/:id/edit" element={
                <ProtectedRoute>
                  <BugForm />
                </ProtectedRoute>
              } />
              
              <Route path="/reusable-fixes" element={
                <ProtectedRoute>
                  <ReusableFixes />
                </ProtectedRoute>
              } />
              
              <Route path="/timeline" element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/bugs" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;