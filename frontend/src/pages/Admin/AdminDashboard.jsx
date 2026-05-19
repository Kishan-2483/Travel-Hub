import { useState, useEffect } from 'react';
import { adminAPI, fraudAPI } from '../../services/api';
import {
  LayoutDashboard, Users, Calendar, DollarSign, AlertTriangle,
  TrendingUp, MapPin, Shield, Eye, CheckCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { loadAdmin(); }, []);

  const loadAdmin = async () => {
    try {
      const [dashRes, usersRes, fraudRes] = await Promise.all([
        adminAPI.getDashboard().catch(() => ({ data: { stats: {}, recent_bookings: [] } })),
        adminAPI.getUsers().catch(() => ({ data: [] })),
        fraudAPI.getReports({}).catch(() => ({ data: { data: [] } })),
      ]);
      setStats(dashRes.data.stats);
      setRecentBookings(dashRes.data.recent_bookings || []);
      setUsers(usersRes.data || []);
      setFraudReports(fraudRes.data?.data || fraudRes.data || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
    { id: 'fraud', label: 'Fraud Reports', icon: <Shield size={16} /> },
  ];

  const overviewStats = stats ? [
    { icon: <MapPin />, label: 'Total Listings', value: stats.total_listings || 0, color: '#6366f1' },
    { icon: <Calendar />, label: 'Total Bookings', value: stats.total_bookings || 0, color: '#3b82f6' },
    { icon: <CheckCircle />, label: 'Confirmed', value: stats.confirmed_bookings || 0, color: '#10b981' },
    { icon: <Clock />, label: 'Pending', value: stats.pending_bookings || 0, color: '#f59e0b' },
    { icon: <DollarSign />, label: 'Revenue', value: `₹${(stats.total_revenue || 0).toLocaleString()}`, color: '#8b5cf6' },
    { icon: <AlertTriangle />, label: 'Open Fraud', value: stats.fraud_reports_open || 0, color: '#ef4444' },
  ] : [];

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><Shield size={28} /> Admin Dashboard</h1>
        <p className="page-subtitle">Manage your platform, users, and operations</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="grid grid-3 admin-stats">
            {overviewStats.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <h3 className="admin-section-title"><TrendingUp size={18} /> Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No bookings yet</p>
          ) : (
            <div className="table-wrapper glass">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b._id?.slice(-8)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.user_id?.slice(-8)}</td>
                      <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}`}>{b.status}</span></td>
                      <td>₹{b.total_price}</td>
                      <td>{new Date(b.created_at || b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          <h3 className="admin-section-title"><Users size={18} /> Registered Users ({users.length})</h3>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No users found</p>
          ) : (
            <div className="table-wrapper glass">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role || 'user'}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="animate-fade-in">
          <h3 className="admin-section-title"><Calendar size={18} /> All Bookings</h3>
          <div className="table-wrapper glass">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Listing</th>
                  <th>Status</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Check In</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b._id?.slice(-8)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.listing_id?.slice(-8)}</td>
                    <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}`}>{b.status}</span></td>
                    <td>{b.guests}</td>
                    <td>${b.total_price}</td>
                    <td>{new Date(b.check_in).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fraud Tab */}
      {activeTab === 'fraud' && (
        <div className="animate-fade-in">
          <h3 className="admin-section-title"><AlertTriangle size={18} /> Fraud Reports</h3>
          {fraudReports.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} />
              <h3>No fraud reports</h3>
              <p>The system is clean — no suspicious activity detected</p>
            </div>
          ) : (
            <div className="table-wrapper glass">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Target User</th>
                    <th>Reason</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fraudReports.map((f, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{f._id?.slice(-8)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{f.target_user_id?.slice(-8)}</td>
                      <td>{f.reason}</td>
                      <td><span className={`badge badge-${f.severity === 'critical' ? 'danger' : f.severity === 'high' ? 'warning' : 'info'}`}>{f.severity}</span></td>
                      <td><span className={`badge badge-${f.status === 'open' ? 'warning' : f.status === 'resolved' ? 'success' : 'primary'}`}>{f.status}</span></td>
                      <td>{new Date(f.created_at || f.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
