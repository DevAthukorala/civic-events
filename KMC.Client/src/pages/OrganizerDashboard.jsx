import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LayoutDashboard, PlusCircle, Calendar, Users, Percent, Edit3, Trash2, Eye, Sparkles } from 'lucide-react';

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

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => { fetchMyEvents(); }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load organizer events.', 'error');
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

  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.maxParticipants, 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const btnOutlineSm = "inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 no-underline transition-all cursor-pointer bg-transparent";

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-5 mb-10">
        <div>
          <h2 className="flex items-center gap-2 font-outfit font-black text-2xl text-slate-900 dark:text-slate-100 mb-1">
            <LayoutDashboard size={28} className="text-indigo-500" /> Organizer Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, <strong className="text-slate-900 dark:text-slate-100">{user?.fullName}</strong>. Manage your municipal council events and citizen registrations.
          </p>
        </div>
        <Link to="/organizer/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' }}>
          <PlusCircle size={18} /> Create New Event
        </Link>
      </div>

      {/* KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Published Events', value: totalEvents, icon: <Calendar size={24} />, iconBg: 'bg-indigo-500/10 text-indigo-500' },
          { label: 'Citizen Registrations', value: totalRegistrations, icon: <Users size={24} />, iconBg: 'bg-sky-500/10 text-sky-500' },
          { label: 'Capacity Utilization', value: `${fillRate}%`, icon: <Percent size={24} />, iconBg: 'bg-emerald-500/10 text-emerald-500' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10 shadow-sm p-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{kpi.label}</div>
              <div className="font-outfit font-black text-4xl text-slate-900 dark:text-slate-100">{kpi.value}</div>
            </div>
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${kpi.iconBg}`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Events table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-slate-100">Your Municipal Events</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of all published council events</p>
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total: <strong className="text-slate-900 dark:text-slate-100">{events.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold"><Sparkles size={20} /> Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="font-outfit font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">No events created yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Click "Create New Event" to publish your first event for Kandy citizens.</p>
            <Link to="/organizer/events/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
              <PlusCircle size={16} /> Create Event Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-700/50">
                  {['Event Title', 'Category', 'Date & Time', 'Capacity', ''].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const isFull = ev.registeredCount >= ev.maxParticipants;
                  return (
                    <tr key={ev.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/events/${ev.id}`} className="font-bold text-slate-900 dark:text-slate-100 no-underline hover:text-indigo-500 transition-colors">
                          {ev.title}
                        </Link>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{ev.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getCategoryColor(ev.category)}`}>{ev.category}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {new Date(ev.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${isFull ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {ev.registeredCount || 0} / {ev.maxParticipants}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/events/${ev.id}`} className={btnOutlineSm} title="View Details"><Eye size={14} /></Link>
                          <Link to={`/organizer/events/${ev.id}/edit`} className={btnOutlineSm} title="Edit"><Edit3 size={14} /></Link>
                          <button onClick={() => handleDelete(ev.id)} title="Delete"
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-0 cursor-pointer transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
