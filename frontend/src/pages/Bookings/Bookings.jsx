import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import './Bookings.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const { data } = await bookingsAPI.getAll().catch(() => ({ data: [] }));
      const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      setBookings([...mockBookings, ...(data || [])]);
    } catch { 
      const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
      setBookings(mockBookings); 
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancel failed');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusConfig = {
    confirmed: { icon: <CheckCircle size={16} />, class: 'badge-success', label: 'Confirmed' },
    pending: { icon: <Clock size={16} />, class: 'badge-warning', label: 'Pending' },
    cancelled: { icon: <XCircle size={16} />, class: 'badge-danger', label: 'Cancelled' },
    completed: { icon: <CheckCircle size={16} />, class: 'badge-info', label: 'Completed' },
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Manage and track all your travel reservations</p>
      </div>

      <div className="bookings-filters">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
          <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No bookings found</h3>
          <p>{filter === 'all' ? "You haven't made any bookings yet" : `No ${filter} bookings`}</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filtered.map((b, i) => (
            <div key={i} className="booking-card-full glass animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="booking-card-img">
                <img src={b.listing?.images?.[0] || '/images/dest1.jpg'} alt="" />
                <span className={`badge ${statusConfig[b.status]?.class || 'badge-primary'}`}>
                  {statusConfig[b.status]?.icon} {statusConfig[b.status]?.label || b.status}
                </span>
              </div>
              <div className="booking-card-body">
                <h3>{b.listing?.title || 'Travel Booking'}</h3>
                <div className="booking-card-meta">
                  <span><MapPin size={14} /> {b.listing?.location?.city || 'N/A'}, {b.listing?.location?.country || ''}</span>
                  <span><Calendar size={14} /> {new Date(b.check_in).toLocaleDateString()} — {new Date(b.check_out).toLocaleDateString()}</span>
                  <span><AlertCircle size={14} /> {b.guests} Guest{b.guests > 1 ? 's' : ''}</span>
                </div>
                <div className="booking-card-footer">
                  <div className="booking-card-price">
                    <CreditCard size={16} />
                    <span className="price-amount">₹{b.total_price}</span>
                  </div>
                  {b.status === 'pending' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
