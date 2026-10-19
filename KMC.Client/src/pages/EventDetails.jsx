import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getEventImage } from '../components/EventCard';
import { Calendar, MapPin, Users, User, ArrowLeft, CheckCircle2, ShieldCheck, Mail, Edit3, Sparkles } from 'lucide-react';

const getCategoryColor = (cat = '') => {
  const map = {
    cultural: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    community: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    technology: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    'food-&-festival': 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
    'food---festival': 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
    'sports-&-youth': 'bg-green-500/15 text-green-300 border border-green-500/30',
    'sports---youth': 'bg-green-500/15 text-green-300 border border-green-500/30',
    'civic-council': 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
  };
  const key = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return map[key] || 'bg-slate-500/15 text-slate-300 border border-slate-500/30';
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchEventDetails(); }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
      if (isAuthenticated && role === 'Participant') {
        const myRegs = await api.get('/registrations/my');
        setMyRegistrations(myRegs.data);
      }
      if (isAuthenticated && role === 'Organizer' && user.id === res.data.organizerId) {
        const partsRes = await api.get(`/events/${id}/participants`);
        setParticipants(partsRes.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Event not found.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) { showToast('Please login to register.', 'info'); navigate('/login'); return; }
    try {
      await api.post('/registrations', { eventId: parseInt(id) });
      showToast('Registration successful!', 'success');
      fetchEventDetails();
    } catch (err) { showToast(err.response?.data?.message || 'Registration failed.', 'error'); }
  };

  const handleCancel = async () => {
    const reg = myRegistrations.find((r) => r.eventId === parseInt(id) && r.status === 'Registered');
    if (!reg) return;
    try {
      await api.delete(`/registrations/${reg.id}`);
      showToast('Registration cancelled.', 'info');
      fetchEventDetails();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to cancel registration.', 'error'); }
  };

  if (loading || !event) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
          <Sparkles size={20} className="spin-animation" /> Loading event details...
        </div>
      </div>
    );
  }

  const isOwner = user && role === 'Organizer' && user.id === event.organizerId;
  const isRegistered = myRegistrations.some((r) => r.eventId === event.id && r.status === 'Registered');
  const isFull = event.registeredCount >= event.maxParticipants;
  const hasPassed = new Date() >= new Date(event.startDate);
  const percentFull = Math.min(100, Math.round(((event.registeredCount || 0) / event.maxParticipants) * 100));

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-lg border border-slate-300 dark:border-white/20 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 no-underline transition-all">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-xl3 border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
        {/* Banner Header */}
        <div className="relative px-10 py-14 text-white overflow-hidden bg-slate-950">
          <img
            src={getEventImage(event)}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/70 -z-10" />

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`backdrop-blur-md flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(event.category)}`}>
              <Sparkles size={13} className="text-amber-300" /> {event.category}
            </span>
            {hasPassed ? (
              <span className="backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-white/20">Closed / Ended</span>
            ) : isFull ? (
              <span className="backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full bg-rose-600/90 text-white shadow-sm border border-rose-300/40">Full Capacity</span>
            ) : (
              <span className="backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400/40">● Registration Open</span>
            )}
          </div>

          <h1 className="font-outfit font-black text-4xl text-white mb-5 leading-tight drop-shadow-sm">{event.title}</h1>

          <div className="flex flex-wrap gap-6 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-amber-400" />
              <span>{new Date(event.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} — {new Date(event.endDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-400" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-amber-400" />
              <span>Organizer: <strong className="text-white">{event.organizerName}</strong></span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-10 grid gap-12" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
          {/* Main Column */}
          <div>
            <h3 className="font-outfit font-bold text-xl mb-4 pb-3 border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100">
              Event Overview &amp; Guidelines
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-line">
              {event.description}
            </p>

            {/* Participants list for owner */}
            {isOwner && (
              <div className="mt-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl2 border border-slate-200 dark:border-white/10 p-8">
                <h3 className="flex items-center gap-2 font-outfit font-bold text-xl mb-5 text-slate-900 dark:text-slate-100">
                  <Users size={22} className="text-indigo-500" /> Registered Citizens ({participants.length})
                </h3>
                {participants.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No citizens have registered for this event yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {participants.map((p) => (
                      <div key={p.registrationId}
                        className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.fullName}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <Mail size={13} /> {p.email}
                          </div>
                        </div>
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/12 text-emerald-500">
                          Registered {new Date(p.registrationDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl2 border border-slate-200 dark:border-white/10 p-6 sticky top-24">
              <h4 className="font-outfit font-bold text-lg mb-5 text-slate-900 dark:text-slate-100">Registration Summary</h4>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Confirmed Registrations</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">
                    {event.registeredCount || 0} / {event.maxParticipants}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div className={`progress-bar-fill ${isFull ? 'full' : ''}`} style={{ width: `${percentFull}%` }} />
                </div>
                <div className="text-right text-xs text-slate-400 mt-1">{percentFull}% capacity filled</div>
              </div>

              {/* Participant actions */}
              {role === 'Participant' && (
                isRegistered ? (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-4 bg-emerald-500/10 px-4 py-3 rounded-xl">
                      <CheckCircle2 size={20} /> You are registered for this event!
                    </div>
                    <button onClick={handleCancel}
                      className="w-full py-2.5 rounded-xl border border-red-400/40 text-red-400 text-sm font-bold bg-transparent hover:bg-red-400/10 cursor-pointer transition-all">
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  <button onClick={handleRegister} disabled={isFull || hasPassed}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm border-0 cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
                    <ShieldCheck size={18} /> {hasPassed ? 'Event Ended' : isFull ? 'Capacity Full' : 'Register for Event'}
                  </button>
                )
              )}

              {/* Organizer actions */}
              {isOwner && (
                <Link to={`/organizer/events/${event.id}/edit`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
                  <Edit3 size={16} /> Edit Event Details
                </Link>
              )}

              {/* Unauthenticated */}
              {!isAuthenticated && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center leading-relaxed">
                    Sign in with your KMC citizen account to register for this municipal event.
                  </p>
                  <Link to="/login"
                    className="flex items-center justify-center w-full py-3 rounded-xl text-white font-bold text-sm no-underline hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
                    Sign In to Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
