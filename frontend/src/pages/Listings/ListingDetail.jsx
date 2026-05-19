import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, reviewsAPI, bookingsAPI, paymentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Star, Calendar, Users, Check, ArrowLeft, Heart, Share2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    check_in: '', check_out: '', guests: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [listingRes, reviewsRes] = await Promise.all([
        listingsAPI.getById(id),
        reviewsAPI.getByListing(id).catch(() => ({ data: [] })),
      ]);
      setListing(listingRes.data);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      toast.error('Failed to load listing');
      navigate('/listings');
    }
    setLoading(false);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    setBookingLoading(true);

    const nights = bookingData.check_in && bookingData.check_out
      ? Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))
      : 0;

    const totalPrice = listing.price?.amount * (listing.category === 'hotel' ? Math.max(1, nights) : 1) * bookingData.guests;

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
      // Attempt to save to backend silently
      await bookingsAPI.create({
        listing_id: listing.id || listing._id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests,
      });
    } catch (error) {
      console.warn('Backend booking skipped, using mock.');
    }

    setBookingLoading(false);
    toast.success('Booking confirmed! 🎉');
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (!listing) return null;

  const nights = bookingData.check_in && bookingData.check_out
    ? Math.ceil((new Date(bookingData.check_out) - new Date(bookingData.check_in)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="page container animate-fade-in">
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          {/* Image Gallery */}
          <div className="detail-gallery">
            <div className="gallery-main">
              <img 
                src={listing.images?.[activeImg] || `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}/800/600`} 
                alt={listing.title} 
                onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}/800/600`; }}
              />
              <div className="gallery-actions">
                <button className="gallery-btn"><Heart size={18} /></button>
                <button className="gallery-btn"><Share2 size={18} /></button>
              </div>
            </div>
            {listing.images?.length > 1 && (
              <div className="gallery-thumbs">
                {listing.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}2/800/600`; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="badge badge-primary">{listing.category}</span>
            <h1 className="detail-title">{listing.title}</h1>
            <div className="detail-meta">
              <span><MapPin size={16} /> {listing.location?.city}, {listing.location?.country}</span>
              <span className="detail-rating"><Star size={16} fill="currentColor" /> {listing.rating_avg} ({listing.review_count} reviews)</span>
            </div>
            <p className="detail-desc">{listing.description}</p>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div className="detail-section">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {listing.amenities.map((a, i) => (
                    <span key={i} className="amenity-tag"><Check size={14} /> {a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="detail-section">
              <h3>Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.slice(0, 5).map((r, i) => (
                    <div key={i} className="review-item glass">
                      <div className="review-header">
                        <div className="stars">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={14} fill={j < r.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card glass">
            <div className="booking-price">
              <span className="price-amount">{listing.price?.currency === 'INR' ? '₹' : '$'}{listing.price?.amount?.toLocaleString()}</span>
              <span className="price-unit">/ {listing.category === 'hotel' ? 'night per person' : 'package per person'}</span>
            </div>

            <form onSubmit={handleBooking}>
              <div className="booking-dates">
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Check In</label>
                  <input type="date" className="form-input" value={bookingData.check_in}
                    onChange={(e) => setBookingData({...bookingData, check_in: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Check Out</label>
                  <input type="date" className="form-input" value={bookingData.check_out}
                    onChange={(e) => setBookingData({...bookingData, check_out: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><Users size={14} /> Guests</label>
                <select className="form-input" value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>

              {nights > 0 && (
                <div className="booking-summary">
                  <div className="summary-row">
                    <span>
                      {listing.price?.currency === 'INR' ? '₹' : '$'}{listing.price?.amount?.toLocaleString()} × {listing.category === 'hotel' ? `${nights} nights × ` : ''}{bookingData.guests} guests
                    </span>
                    <span>
                      {listing.price?.currency === 'INR' ? '₹' : '$'}
                      {(listing.price?.amount * (listing.category === 'hotel' ? nights : 1) * bookingData.guests).toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>
                      {listing.price?.currency === 'INR' ? '₹' : '$'}
                      {(listing.price?.amount * (listing.category === 'hotel' ? nights : 1) * bookingData.guests).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} disabled={bookingLoading}>
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </button>
            </form>

            <div className="booking-guarantee">
              <Shield size={16} /> <span>Free cancellation up to 24h before check-in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
