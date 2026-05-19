import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, notificationsAPI } from '../../services/api';
import {
  LayoutDashboard, Calendar, MapPin, CreditCard, Star,
  ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [bookingsRes, notifRes] = await Promise.all([
        bookingsAPI.getAll().catch(() => ({ data: [] })),
        notificationsAPI.getAll().catch(() => ({ data: { notifications: [], unreadCount: 0 } })),
      ]);
      const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      setBookings([...mockBookings, ...(bookingsRes.data || [])]);
      setNotifications(notifRes.data?.notifications || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} className="text-success" />;
      case 'cancelled': return <XCircle size={16} className="text-danger" />;
      case 'pending': return <Clock size={16} className="text-warning" />;
      default: return <AlertCircle size={16} />;
    }
  };

  const statusBadge = (status) => {
    const map = { confirmed: 'badge-success', cancelled: 'badge-danger', pending: 'badge-warning', completed: 'badge-info' };
    return `badge ${map[status] || 'badge-primary'}`;
  };

  const stats = [
    { icon: <Calendar />, label: 'Total Trips', value: bookings.length, color: '#6366f1' },
    { icon: <CheckCircle />, label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: '#10b981' },
    { icon: <Clock />, label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
    { icon: <CreditCard />, label: 'Total Spent', value: `₹${bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}`, color: '#8b5cf6' },
  ];

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <div className="dashboard-welcome">
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's what's happening with your trips</p>
        </div>
        <Link to="/listings" className="btn btn-primary">
          Explore More <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-4 dashboard-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Bookings */}
        <div className="dashboard-section">
          <div className="section-header-row">
            <h2><TrendingUp size={20} /> Recent Bookings</h2>
            <Link to="/bookings" className="btn btn-ghost btn-sm">View All</Link>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No bookings yet</h3>
              <p>Start exploring destinations and book your first trip!</p>
              <Link to="/listings" className="btn btn-primary">Browse Listings</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.slice(0, 5).map((b, i) => (
                <div key={i} className="booking-item glass">
                  <div className="booking-item-left">
                    <img
                      src={b.listing?.images?.[0] || '/images/dest1.jpg'}
                      alt=""
                      className="booking-thumb"
                    />
                    <div>
                      <h4>{b.listing?.title || 'Travel Booking'}</h4>
                      <p className="booking-dates-text">
                        <MapPin size={12} /> {b.listing?.location?.city || 'N/A'}
                        &nbsp;·&nbsp;
                        <Calendar size={12} /> {new Date(b.check_in).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="booking-item-right">
                    <span className="booking-amount">₹{b.total_price}</span>
                    <span className={statusBadge(b.status)}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Notifications */}
        <div className="dashboard-aside">
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/planner" className="quick-action glass">
                <Calendar size={20} />
                <span>Trip Planner</span>
              </Link>
              <Link to="/chat" className="quick-action glass">
                <Star size={20} />
                <span>Support Chat</span>
              </Link>
              <Link to="/listings" className="quick-action glass">
                <MapPin size={20} />
                <span>Explore Map</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-muted" style={{fontSize:'0.88rem'}}>No notifications yet</p>
            ) : (
              <div className="notif-list-mini">
                {notifications.slice(0, 4).map((n, i) => (
                  <div key={i} className="notif-item-mini">
                    <div className={`notif-dot ${n.read ? '' : 'unread'}`} />
                    <div>
                      <p className="notif-title-mini">{n.title}</p>
                      <p className="notif-time-mini">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
