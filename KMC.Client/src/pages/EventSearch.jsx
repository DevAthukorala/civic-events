import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Calendar, MapPin, Tag, RefreshCw, Sparkles } from 'lucide-react';

const EventSearch = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const { isAuthenticated, role } = useAuth();
  const { showToast } = useToast();

  const categories = ['All', 'Cultural', 'Community', 'Technology', 'Food & Festival', 'Sports & Youth', 'Civic Council'];

  useEffect(() => {
    handleSearch();
    if (isAuthenticated && role === 'Participant') fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try { const res = await api.get('/registrations/my'); setMyRegistrations(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const params = {};
      if (name) params.name = name;
      if (category && category !== 'All') params.category = category;
      if (date) params.date = date;
      if (location) params.location = location;
      const res = await api.get('/events/search', { params });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('Search query failed.', 'error');
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setName(''); setCategory('All'); setDate(''); setLocation('');
    api.get('/events/search').then((res) => setEvents(res.data));
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";
  const labelCls = "flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="flex items-center gap-2 font-outfit font-black text-2xl text-slate-900 dark:text-slate-100 mb-1">
          <Search size={26} className="text-indigo-500" /> Search &amp; Filter Events
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Find municipal council events by title, category, date, or venue across Kandy.
        </p>
      </div>

      {/* Filter card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10 shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
          <div>
            <label className={labelCls}><Search size={14} className="text-indigo-500" /> Event Name / Keyword</label>
            <input type="text" className={inputCls} placeholder="e.g. Esala Perahera"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}><Tag size={14} className="text-indigo-500" /> Category</label>
            <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}><Calendar size={14} className="text-indigo-500" /> Event Date</label>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}><MapPin size={14} className="text-indigo-500" /> Venue / Location</label>
            <input type="text" className={inputCls} placeholder="e.g. Temple Square"
              value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit"
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-white font-bold text-sm border-0 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
              <Filter size={16} /> Filter
            </button>
            <button type="button" onClick={handleReset} title="Reset Filters"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 bg-transparent cursor-pointer transition-all">
              <RefreshCw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
            <Sparkles size={20} className="spin-animation" /> Searching events...
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">No events match your criteria</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 text-sm">
            Try broadening your search parameters, picking a different category, or resetting filters.
          </p>
          <button onClick={handleReset}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' }}>
            Show All Events
          </button>
        </div>
      ) : (
        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold mb-4">
            Found <strong className="text-slate-900 dark:text-slate-100">{events.length}</strong> matching event{events.length === 1 ? '' : 's'}
          </p>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {events.map((ev) => {
              const isReg = myRegistrations.some((r) => r.eventId === ev.id && r.status === 'Registered');
              return (
                <EventCard key={ev.id} event={ev} isRegistered={isReg}
                  onRegister={async (eventId) => {
                    if (!isAuthenticated) return;
                    await api.post('/registrations', { eventId });
                    showToast('Registered successfully!', 'success');
                    handleSearch(); fetchMyRegistrations();
                  }}
                  onCancel={async (eventId) => {
                    const reg = myRegistrations.find((r) => r.eventId === eventId);
                    if (reg) { await api.delete(`/registrations/${reg.id}`); showToast('Cancelled registration', 'info'); handleSearch(); fetchMyRegistrations(); }
                  }}
                  onDelete={async (eventId) => {
                    await api.delete(`/events/${eventId}`);
                    showToast('Event deleted', 'success'); handleSearch();
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSearch;
