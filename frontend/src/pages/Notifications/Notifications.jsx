import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import { Bell, CheckCheck, Calendar, CreditCard, Star, MessageSquare, Info, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getAll();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { setNotifications([]); }
    setLoading(false);
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to update');
    }
  };

  const typeIcon = (type) => {
    const icons = {
      booking: <Calendar size={18} />,
      payment: <CreditCard size={18} />,
      review: <Star size={18} />,
      chat: <MessageSquare size={18} />,
      system: <Info size={18} />,
    };
    return icons[type] || <Bell size={18} />;
  };

  const typeColor = (type) => {
    const colors = {
      booking: '#6366f1', payment: '#10b981', review: '#f59e0b',
      chat: '#3b82f6', system: '#8b5cf6',
    };
    return colors[type] || '#64748b';
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No notifications yet</h3>
          <p>We'll notify you about bookings, messages, and more</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((n, i) => (
            <div
              key={i}
              className={`notif-item glass ${!n.read ? 'unread' : ''}`}
              onClick={() => !n.read && handleMarkRead(n._id)}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="notif-icon" style={{ background: `${typeColor(n.type)}15`, color: typeColor(n.type) }}>
                {typeIcon(n.type)}
              </div>
              <div className="notif-content">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              {!n.read && <div className="notif-unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
