import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, Compass, ArrowRight, Globe, Sparkles, Zap } from 'lucide-react';
import './Home.css';

export default function Home() {
  const features = [
    { icon: <Globe />, title: 'Global Destinations', desc: 'Explore 1000+ destinations across all continents with curated local experiences.' },
    { icon: <Shield />, title: 'Secure Booking', desc: 'Book with confidence. Our fraud detection system keeps your transactions safe.' },
    { icon: <Sparkles />, title: 'Smart Planner', desc: 'AI-powered travel planner that creates personalized itineraries just for you.' },
    { icon: <Zap />, title: 'Real-time Support', desc: 'Live chat with travel experts. Get instant help with bookings and recommendations.' },
  ];

  const places = [
    "Taj Mahal", "Goa", "Jaipur", "Manali", "Leh", "Golden Temple", "Shimla", 
    "Udaipur", "Varanasi", "Srinagar", "Ooty", "Darjeeling", "Munnar", 
    "Kerala Backwaters", "Pondicherry", "Rishikesh", "Jim Corbett National Park", 
    "Mysore Palace", "Hampi", "Ajanta Caves", "Ellora Caves", "Vaishno Devi Temple", 
    "Ranthambore National Park", "Andaman Islands", "Mumbai", "Spiti Valley"
  ];

  const unsplashIds = [
    '1524492412937-b28074a5d7da', '1512343879784-a960bf40e7f2', '1598324789736-4861f89564a0',
    '1587478640470-a20d4e73b22e', '1564507592227-cb84b196e862', '1506461883276-59b1e967a57a',
    '1476514525535-07fb3b4ae5f1', '1501785888041-af3ef285b470', '1469854523086-cc02fe5d8800',
    '1452421822248-d4c2b47f0c81', '1436491865332-7a61ce2ed9ce'
  ];

  const packages = ['Adventure Package', 'Cultural Tour', 'Honeymoon Special', 'Weekend Getaway', 'Luxury Retreat', 'Spiritual Journey'];
  const hotels = ['Taj Palace', 'Oberoi Hotels', 'ITC Grand', 'Leela Palace', 'Marriott Resort', 'Radisson Blu'];

  const destinations = places.map((place, index) => {
    const pkg = packages[index % packages.length];
    const hotel = hotels[index % hotels.length];
    return {
      name: place,
      img: `https://images.unsplash.com/photo-${unsplashIds[index % unsplashIds.length]}?q=80&w=600&auto=format&fit=crop`,
      price: `From ₹${(Math.floor(Math.random() * 50) + 15) * 1000}/package`,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      packageType: pkg,
      hotelInfo: `Stay at ${hotel} • 3N/4D`,
      about: `Experience the beauty of ${place} with our exclusive ${pkg}.`
    };
  });

  const marqueeImages = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587478640470-a20d4e73b22e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506461883276-59b1e967a57a?q=80&w=600&auto=format&fit=crop'
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <div className="hero-badge">
              <Compass size={14} /> Discover India
            </div>
            <h1 className="hero-title">
              Your Next <span className="gradient-text">Adventure</span><br />
              Starts Here
            </h1>
            <p className="hero-subtitle">
              Plan, book, and experience unforgettable journeys across incredible India. From majestic palaces to serene backwaters.
            </p>
            <div className="hero-actions">
              <Link to="/listings" className="btn btn-primary btn-lg">
                Explore Destinations <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started Free
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">25+</span>
                <span className="hero-stat-label">Destinations</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">50K+</span>
                <span className="hero-stat-label">Happy Travelers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">4.9</span>
                <span className="hero-stat-label">Avg. Rating</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="scrolling-images">
              {marqueeImages.concat(marqueeImages).map((img, i) => (
                <div key={i} className="marquee-img-wrapper">
                  <img 
                    src={img} 
                    alt="Destination" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/travel${i}/600/400`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="gradient-text">TravelHub</span></h2>
          <p className="section-subtitle">Everything you need for the perfect trip, in one platform.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Trending <span className="gradient-text">Destinations</span></h2>
          <p className="section-subtitle">Most popular picks by our community of travelers.</p>
        </div>
        <div className="destinations-grid">
          {destinations.map((d, i) => (
            <Link to={`/listings?search=${encodeURIComponent(d.name.split(',')[0])}`} key={i} className="destination-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="destination-img">
                <img 
                  src={d.img} 
                  alt={d.name} 
                  loading="lazy" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/seed/${d.name.replace(/\s+/g, '')}/600/400`;
                  }}
                />
                <div className="destination-overlay" />
              </div>
              <div className="destination-info">
                <div className="destination-top">
                  <h3><MapPin size={16} /> {d.name}</h3>
                  <div className="destination-rating">
                    <Star size={14} fill="currentColor" /> {d.rating}
                  </div>
                </div>
                <div className="destination-about">
                  <p className="pkg-type"><Compass size={12}/> {d.packageType}</p>
                  <p className="hotel-info"><Shield size={12}/> {d.hotelInfo}</p>
                  <p className="about-text">{d.about}</p>
                </div>
                <span className="destination-price">{d.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of travelers who plan their perfect trips with TravelHub.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <Compass size={24} />
              <span>TravelHub</span>
            </div>
            <p className="footer-text">© 2026 TravelHub. Crafted with ❤ for adventurers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
