import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listingsAPI } from '../../services/api';
import { Search, MapPin, Star, Filter, SlidersHorizontal } from 'lucide-react';
import './Listings.css';

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchListings();
  }, [category, sortBy]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { sort: sortBy, order: 'desc' };
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await listingsAPI.getAll(params);
      setListings(data.data || data || []);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setListings([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const categories = [
    { value: '', label: 'All' },
    { value: 'hotel', label: '🏨 Hotels' },
    { value: 'tour', label: '🗺️ Tours' },
    { value: 'package', label: '📦 Packages' },
    { value: 'flight', label: '✈️ Flights' },
  ];

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Explore Destinations</h1>
        <p className="page-subtitle">Find your perfect getaway from our curated collection</p>
      </div>

      {/* Search & Filters */}
      <div className="listings-filters glass">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search destinations, hotels, tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <div className="filter-row">
          <div className="filter-pills">
            {categories.map(c => (
              <button
                key={c.value}
                className={`filter-pill ${category === c.value ? 'active' : ''}`}
                onClick={() => setCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="sort-select">
            <SlidersHorizontal size={16} />
            <select className="form-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created_at">Newest</option>
              <option value="price.amount">Price</option>
              <option value="rating_avg">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <Filter size={48} />
          <h3>No listings found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing, i) => (
            <Link
              to={`/listings/${listing.id}`}
              key={listing.id}
              className="listing-card card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="listing-image">
                <img
                  src={listing.images?.[0] || `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}/600/400`}
                  alt={listing.title}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${listing.title.replace(/\s+/g, '')}/600/400`; }}
                />
                <span className="listing-category badge badge-primary">{listing.category}</span>
              </div>
              <div className="card-body">
                <h3 className="listing-title">{listing.title}</h3>
                <div className="listing-location">
                  <MapPin size={14} />
                  <span>{listing.location?.city}, {listing.location?.country}</span>
                </div>
                <p className="listing-desc">{listing.description?.substring(0, 100)}...</p>
                <div className="listing-footer">
                  <div className="listing-price">
                    <span className="price-amount">
                      {listing.price?.currency === 'INR' ? '₹' : '$'}{listing.price?.amount?.toLocaleString()}
                    </span>
                    <span className="price-unit">{listing.category === 'hotel' ? '/night' : '/package'}</span>
                  </div>
                  <div className="listing-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{listing.rating_avg || 0}</span>
                    <span className="review-count">({listing.review_count || 0})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
