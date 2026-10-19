import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { BookmarkCheck, Calendar, MapPin, ArrowRight, XCircle, Sparkles } from 'lucide-react';

const getCategoryColor = (cat = '') => {
  const map = {
    cultural: 'bg-violet-500/15 text-violet-400',
    community: 'bg-emerald-500/15 text-emerald-400',
    technology: 'bg-sky-500/15 text-sky-400',
    'food-&-festival': 'bg-orange-500/15 text-orange-400',
    'food---festival': 'bg-orange-500/15 text-orange-400',
    'sports-&-youth': 'bg-green-500/15 text-green-400',
    'sports---youth': 'bg-green-500/15 text-green-400',
    'civic-council': 'bg-indigo-500/15 text-indigo-400',
  };
  const key = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return map[key] || 'bg-slate-500/15 text-slate-400';
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => { fetchMyRegistrations(); }, []);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations/my');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load your registrations.', 'error');
    } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      showToast('Registration cancelled.', 'info');
      fetchMyRegistrations();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to cancel registration.', 'error'); }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="flex items-center gap-2 font-outfit font-black text-2xl text-slate-900 dark:text-slate-100 mb-1">
          <BookmarkCheck size={28} className="text-indigo-500" /> My Registered Events
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Track and manage your active event participation across Kandy Municipal Council events.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
            <Sparkles size={20} className="spin-animation" /> Loading your registrations...
          </div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
            <BookmarkCheck size={32} />
          </div>
          <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">No registered events found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            Browse available municipal events in Kandy and secure your spot today.
          </p>
          <Link to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {registrations.map((reg) => (
            <div key={reg.id}
              className="flex items-center justify-between flex-wrap gap-6 bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10 px-7 py-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${getCategoryColor(reg.eventCategory)}`}>
                    <Sparkles size={11} /> {reg.eventCategory}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border
                    ${reg.status === 'Registered'
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-500 border-rose-500/30'}`}>
                    ● {reg.status}
                  </span>
                </div>
                <h3 className="font-outfit font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">{reg.eventTitle}</h3>
                <div className="flex gap-5 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-indigo-500" />
                    {new Date(reg.eventStartDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-indigo-500" />
                    {reg.eventLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/events/${reg.eventId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 text-sm font-semibold text-slate-700 dark:text-slate-200 no-underline hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                  View Details <ArrowRight size={14} />
                </Link>
                {reg.status === 'Registered' && (
                  <button onClick={() => handleCancel(reg.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400/40 text-sm font-semibold text-red-400 bg-transparent hover:bg-red-400/10 cursor-pointer transition-all">
                    <XCircle size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
