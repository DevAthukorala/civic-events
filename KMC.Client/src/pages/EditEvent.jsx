import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { getEventImage } from '../components/EventCard';
import { Edit3, ArrowLeft, Calendar, MapPin, Tag, Users, FileText, Sparkles, Eye, Image as ImageIcon } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [organizerName, setOrganizerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = ['Cultural', 'Community', 'Technology', 'Food & Festival', 'Sports & Youth', 'Civic Council'];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      const ev = res.data;
      setTitle(ev.title);
      setDescription(ev.description);
      setCategory(ev.category);
      setLocation(ev.location);
      setMaxParticipants(ev.maxParticipants);
      setRegisteredCount(ev.registeredCount || 0);
      setOrganizerName(ev.organizerName || 'Organizer');

      if (ev.startDate) {
        const d1 = new Date(ev.startDate);
        d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());
        setStartDate(d1.toISOString().slice(0, 16));
      }
      if (ev.endDate) {
        const d2 = new Date(ev.endDate);
        d2.setMinutes(d2.getMinutes() - d2.getTimezoneOffset());
        setEndDate(d2.toISOString().slice(0, 16));
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load event details.', 'error');
      navigate('/organizer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      showToast('End date cannot be earlier than start date.', 'error');
      return;
    }
    try {
      setSubmitting(true);
      await api.put(`/events/${id}`, {
        title,
        description,
        category,
        location,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        maxParticipants: parseInt(maxParticipants),
      });
      showToast('Event updated successfully!', 'success');
      navigate('/organizer/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Live preview
  const previewEvent = {
    id: parseInt(id),
    title: title || 'Event Title',
    description: description || 'Description will appear here...',
    category,
    location: location || 'Location',
    startDate: startDate || new Date().toISOString(),
    registeredCount,
    maxParticipants: parseInt(maxParticipants) || 100,
    organizerName,
  };

  const matchedImage = getEventImage(previewEvent);

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";
  const labelCls = "flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
          <Sparkles size={20} className="spin-animation" /> Loading event details...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <Link to="/organizer/dashboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-lg border border-slate-300 dark:border-white/20 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 no-underline transition-all">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Edit Form ── */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md p-8">
          <div className="mb-8">
            <h2 className="flex items-center gap-2 font-outfit font-black text-3xl text-slate-900 dark:text-slate-100 mb-1">
              <Edit3 size={28} className="text-indigo-500" /> Edit Municipal Event
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Update event details and schedule parameters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Event Title</label>
              <input
                type="text"
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <span className="text-[0.75rem] text-slate-400 mt-1 block">
                💡 Tip: Keywords in the title auto-assign relevant Kandy gallery images.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><Tag size={15} className="text-indigo-500" /> Category</label>
                <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} required>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}><Users size={15} className="text-indigo-500" /> Maximum Capacity</label>
                <input
                  type="number"
                  className={inputCls}
                  min={1}
                  max={100000}
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}><MapPin size={15} className="text-indigo-500" /> Venue Location</label>
              <input
                type="text"
                className={inputCls}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><Calendar size={15} className="text-indigo-500" /> Start Date &amp; Time</label>
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelCls}><Calendar size={15} className="text-indigo-500" /> End Date &amp; Time</label>
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}><FileText size={15} className="text-indigo-500" /> Description &amp; Guidelines</label>
              <textarea
                className={inputCls}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-white font-bold text-sm border-0 cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}
              >
                {submitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <Link
                to="/organizer/dashboard"
                className="flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-sm font-bold text-slate-700 dark:text-slate-200 no-underline hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* ── Right Column: Live Event Card Preview ── */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Eye size={15} className="text-indigo-500" /> Live Citizen Card Preview
            </span>
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <ImageIcon size={11} /> Auto-Matched Image
            </span>
          </div>

          {/* Preview Card */}
          <div className="flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
            {/* Banner with matched image */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <img
                src={matchedImage}
                alt="Event preview banner"
                className="w-full h-full object-cover opacity-55 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/50" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className="backdrop-blur-md flex items-center gap-1.5 text-[0.72rem] font-bold px-3 py-1 rounded-full bg-indigo-600/80 text-white shadow-sm border border-indigo-400/40">
                  <Sparkles size={11} className="text-amber-300" /> {category}
                </span>
                <span className="backdrop-blur-md text-[0.72rem] font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400/40">
                  ● Open
                </span>
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-slate-200 truncate">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span className="truncate drop-shadow-md">{location || 'Venue location'}</span>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-5 flex flex-col gap-3">
              <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-2">
                {title || 'Event Title'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                {description || 'Event description...'}
              </p>

              <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-indigo-500 shrink-0" />
                  <span>
                    {startDate ? new Date(startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Start date & time'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{registeredCount} / {maxParticipants}</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${Math.min(100, Math.round(((registeredCount || 0) / maxParticipants) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
