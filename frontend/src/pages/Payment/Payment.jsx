import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { bookingsAPI } from '../../services/api';
import './Payment.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { listing, bookingData, nights, totalPrice } = location.state || {};

  if (!listing) {
    return (
      <div className="page container">
        <p>No booking details found. Please start over.</p>
        <button className="btn btn-primary" onClick={() => navigate('/listings')}>Go to Listings</button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create a mock booking to store locally
    const mockBooking = {
      _id: 'mock_' + Date.now(),
      id: 'mock_' + Date.now(),
      listing_id: listing.id || listing._id,
      listing: listing,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      guests: bookingData.guests,
      status: 'confirmed',
      total_price: totalPrice,
      created_at: new Date().toISOString()
    };
    
    const existingMocks = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    localStorage.setItem('mockBookings', JSON.stringify([mockBooking, ...existingMocks]));

    try {
      // Try backend but don't block
      await bookingsAPI.create({
        listing_id: listing.id || listing._id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests,
      });
    } catch (error) {
      console.warn('Backend booking skipped, using mock.', error);
    }

    // Mock payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Booked successfully! 🎉');
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="page container success-page animate-fade-in">
        <div className="success-card glass">
          <CheckCircle size={64} className="text-success" style={{ color: '#10b981', marginBottom: '1rem', margin: '0 auto 1rem auto' }} />
          <h2>Booking Confirmed!</h2>
          <p>You have successfully booked {listing.title}.</p>
          <p className="text-muted mt-4">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container animate-fade-in">
      <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Listing
      </button>

      <div className="payment-layout">
        <div className="payment-form-container glass">
          <h2>Payment Details</h2>
          <p className="text-muted mb-4">Complete your booking securely.</p>
          <form onSubmit={handlePayment} className="payment-form">
            <div className="form-group">
              <label className="form-label">Name on Card</label>
              <input type="text" className="form-input" required placeholder="John Doe" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input type="text" className="form-input" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry (MM/YY)</label>
                <input type="text" className="form-input" required placeholder="MM/YY" maxLength="5" />
              </div>
              <div className="form-group">
                <label className="form-label">CVC</label>
                <input type="password" className="form-input" required placeholder="123" maxLength="4" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-4" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Processing...' : `Pay ${listing.price?.currency === 'INR' ? '₹' : '$'}${totalPrice?.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div className="payment-summary glass">
          <h3>Booking Summary</h3>
          <div className="summary-item mt-4">
            <img src={listing.images?.[0] || `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}/400/300`} alt={listing.title} className="summary-img" />
            <div className="summary-details">
              <h4>{listing.title}</h4>
              <p className="text-muted">{listing.location?.city}, {listing.location?.country}</p>
            </div>
          </div>
          
          <div className="summary-dates mt-4">
            <div className="date-item">
              <span className="text-muted">Check in</span>
              <strong>{new Date(bookingData.check_in).toLocaleDateString()}</strong>
            </div>
            <div className="date-item" style={{ textAlign: 'right' }}>
              <span className="text-muted">Check out</span>
              <strong>{new Date(bookingData.check_out).toLocaleDateString()}</strong>
            </div>
          </div>
          
          <hr className="my-4" style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />
          
          <div className="summary-price">
            <div className="price-row">
              <span>{listing.price?.currency === 'INR' ? '₹' : '$'}{listing.price?.amount?.toLocaleString()} × {listing.category === 'hotel' ? `${nights} nights × ` : ''}{bookingData.guests} guests</span>
              <span>{listing.price?.currency === 'INR' ? '₹' : '$'}{totalPrice?.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Taxes & Fees</span>
              <span>{listing.price?.currency === 'INR' ? '₹' : '$'}0</span>
            </div>
            <div className="price-row total mt-4">
              <strong>Total</strong>
              <strong>{listing.price?.currency === 'INR' ? '₹' : '$'}{totalPrice?.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
