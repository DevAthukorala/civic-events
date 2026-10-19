import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { getEventImage } from '../components/EventCard';
import { PlusCircle, ArrowLeft, Calendar, MapPin, Tag, Users, FileText, Sparkles, Eye, Image as ImageIcon } from 'lucide-react';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cultural');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = ['Cultural', 'Community', 'Technology', 'Food & Festival', 'Sports & Youth', 'Civic Council'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      showToast('End date cannot be earlier than start date.', 'error');
      return;
    }
    try {
      setLoading(true);
      await api.post('/events', {
        title,
        description,
        category,
        location,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        maxParticipants: parseInt(maxParticipants),
      });
      showToast('Event created successfully!', 'success');
      navigate('/organizer/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Preview object for the live card preview
  const previewEvent = {
    title: title || 'Your Event Title Here...',
    description: description || 'Event overview and guidelines will appear here as you type...',
    category,
    location: location || 'Kandy, Sri Lanka',
    startDate: startDate || new Date().toISOString(),
    registeredCount: 0,
    maxParticipants: parseInt(maxParticipants) || 100,
    organizerName: 'Your Organizer Account',
  };

  const matchedImage = getEventImage(previewEvent);

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";
  const labelCls = "flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <Link to="/organizer/dashboard"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-lg border border-slate-300 dark:border-white/20 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 no-underline transition-all">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Form ── */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md p-8">
          <div className="mb-8">
            <h2 className="flex items-center gap-2 font-outfit font-black text-3xl text-slate-900 dark:text-slate-100 mb-1">
              <PlusCircle size={28} className="text-indigo-500" /> Create Municipal Event
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Publish a new official event on the Kandy Municipal Council Platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Event Title</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Kandy Esala Perahera Cultural Showcase 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <span className="text-[0.75rem] text-slate-400 mt-1 block">
                💡 Tip: Mentioning keywords (e.g. <em>Perahera, Lake, Food, Temple, Tech, Buddha, Heritage</em>) auto-assigns matching Kandy photography.
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
                placeholder="e.g. Sacred Temple Square, Kandy"
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
                placeholder="Provide event overview, schedule highlights, entrance guidelines, and public notices..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-white font-bold text-sm border-0 cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}
              >
                {loading ? 'Publishing Event...' : 'Publish Event'}
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
                <span className="truncate drop-shadow-md">{location || 'Venue will appear here'}</span>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-5 flex flex-col gap-3">
              <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-2">
                {title || 'Event Title Preview'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                {description || 'Event description will display here to citizens browsing events on the portal.'}
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
                  <span className="font-bold text-slate-700 dark:text-slate-300">0 / {maxParticipants}</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
