import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Listings from './pages/Listings/Listings';
import ListingDetail from './pages/Listings/ListingDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import Planner from './pages/Planner/Planner';
import Bookings from './pages/Bookings/Bookings';
import Payment from './pages/Payment/Payment';
import Chat from './pages/Chat/Chat';
import Notifications from './pages/Notifications/Notifications';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './App.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/planner" element={
            <ProtectedRoute><Planner /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><Bookings /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/chat/:roomId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute><Notifications /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
