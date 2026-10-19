import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { useToast } from '../context/ToastContext';
import { Calendar, PlusCircle, Sparkles } from 'lucide-react';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => { fetchMyEvents(); }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load your events.', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      showToast('Event deleted successfully.', 'success');
      fetchMyEvents();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete event.', 'error'); }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="flex items-center gap-2 font-outfit font-black text-2xl text-slate-900 dark:text-slate-100 mb-1">
            <Calendar size={28} className="text-indigo-500" /> My Published Events
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            All municipal events created and managed under your organizer account.
          </p>
        </div>
        <Link to="/organizer/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' }}>
          <PlusCircle size={18} /> Create New Event
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
            <Sparkles size={20} className="spin-animation" /> Loading events...
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
            <Calendar size={32} />
          </div>
          <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">No events created yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Start by publishing your first civic or cultural event for Kandy citizens.</p>
          <Link to="/organizer/events/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
            <PlusCircle size={16} /> Create Event Now
          </Link>
        </div>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
