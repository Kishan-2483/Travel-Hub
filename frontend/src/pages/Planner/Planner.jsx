import { useState } from 'react';
import { Calendar, MapPin, Plus, Trash2, GripVertical, Clock, DollarSign, Sparkles } from 'lucide-react';
import './Planner.css';

export default function Planner() {
  const [trip, setTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
  });
  const [days, setDays] = useState([]);
  const [showForm, setShowForm] = useState(true);

  const createItinerary = (e) => {
    e.preventDefault();
    if (!trip.startDate || !trip.endDate) return;

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newDays = Array.from({ length: numDays }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return {
        id: i + 1,
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        activities: [],
      };
    });

    setDays(newDays);
    setShowForm(false);
  };

  const addActivity = (dayIndex) => {
    const updated = [...days];
    updated[dayIndex].activities.push({
      id: Date.now(),
      time: '09:00',
      title: '',
      type: 'sightseeing',
      notes: '',
      cost: 0,
    });
    setDays(updated);
  };

  const updateActivity = (dayIndex, actIndex, field, value) => {
    const updated = [...days];
    updated[dayIndex].activities[actIndex][field] = value;
    setDays(updated);
  };

  const removeActivity = (dayIndex, actIndex) => {
    const updated = [...days];
    updated[dayIndex].activities.splice(actIndex, 1);
    setDays(updated);
  };

  const totalCost = days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (parseFloat(a.cost) || 0), 0), 0);

  const activityTypes = [
    { value: 'sightseeing', label: '🏛️ Sightseeing' },
    { value: 'food', label: '🍽️ Food & Dining' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'hotel', label: '🏨 Accommodation' },
    { value: 'adventure', label: '🏔️ Adventure' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'rest', label: '😴 Rest' },
  ];

  return (
    <div className="page container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><Sparkles size={28} /> Trip Planner</h1>
        <p className="page-subtitle">Create your perfect itinerary day by day</p>
      </div>

      {showForm ? (
        <div className="planner-setup glass animate-fade-in">
          <h2>Plan a New Trip</h2>
          <form onSubmit={createItinerary} className="planner-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Trip Name</label>
                <input type="text" className="form-input" placeholder="Summer Vacation 2026"
                  value={trip.name} onChange={(e) => setTrip({...trip, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input type="text" className="form-input" placeholder="Bali, Indonesia"
                  value={trip.destination} onChange={(e) => setTrip({...trip, destination: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><Calendar size={14} /> Start Date</label>
                <input type="date" className="form-input" value={trip.startDate}
                  onChange={(e) => setTrip({...trip, startDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label"><Calendar size={14} /> End Date</label>
                <input type="date" className="form-input" value={trip.endDate}
                  onChange={(e) => setTrip({...trip, endDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label"><DollarSign size={14} /> Budget (USD)</label>
                <input type="number" className="form-input" placeholder="2000"
                  value={trip.budget} onChange={(e) => setTrip({...trip, budget: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Create Itinerary</button>
          </form>
        </div>
      ) : (
        <>
          {/* Trip Header */}
          <div className="planner-header glass">
            <div className="planner-header-info">
              <h2>{trip.name || 'My Trip'}</h2>
              <p><MapPin size={14} /> {trip.destination} · {days.length} days · {trip.startDate} to {trip.endDate}</p>
            </div>
            <div className="planner-header-stats">
              <div className="planner-stat">
                <span className="planner-stat-value">₹{totalCost}</span>
                <span className="planner-stat-label">Est. Cost</span>
              </div>
              {trip.budget && (
                <div className="planner-stat">
                  <span className="planner-stat-value" style={{color: totalCost > trip.budget ? 'var(--danger)' : 'var(--success)'}}>
                    ₹{trip.budget - totalCost}
                  </span>
                  <span className="planner-stat-label">Remaining</span>
                </div>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(true)}>Edit Trip</button>
            </div>
          </div>

          {/* Day Cards */}
          <div className="planner-days">
            {days.map((day, dayIndex) => (
              <div key={day.id} className="day-card glass animate-fade-in" style={{ animationDelay: `${dayIndex * 0.05}s` }}>
                <div className="day-header">
                  <div>
                    <span className="day-number">Day {day.id}</span>
                    <span className="day-date">{day.label}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => addActivity(dayIndex)}>
                    <Plus size={16} /> Add Activity
                  </button>
                </div>

                {day.activities.length === 0 ? (
                  <p className="day-empty">No activities planned. Click "Add Activity" to start.</p>
                ) : (
                  <div className="activities-list">
                    {day.activities.map((act, actIndex) => (
                      <div key={act.id} className="activity-item">
                        <div className="activity-grip"><GripVertical size={16} /></div>
                        <div className="activity-time">
                          <input type="time" value={act.time}
                            onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)} />
                        </div>
                        <div className="activity-details">
                          <input type="text" placeholder="Activity name" value={act.title}
                            onChange={(e) => updateActivity(dayIndex, actIndex, 'title', e.target.value)}
                            className="activity-title-input" />
                          <div className="activity-meta-row">
                            <select value={act.type}
                              onChange={(e) => updateActivity(dayIndex, actIndex, 'type', e.target.value)}
                              className="activity-type-select">
                              {activityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                            <div className="activity-cost">
                              <DollarSign size={14} />
                              <input type="number" placeholder="0" value={act.cost}
                                onChange={(e) => updateActivity(dayIndex, actIndex, 'cost', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <button className="activity-remove" onClick={() => removeActivity(dayIndex, actIndex)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
