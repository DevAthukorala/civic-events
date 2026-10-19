import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Edit3, Trash2, ArrowRight, CheckCircle2, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Available Kandy local scenic and cultural images
const EVENT_IMAGES = [
  '/imgs/images (1).jpg', // Perahera / cultural pageant
  '/imgs/kandy-3.jpg', // Lake / nature / morning
  '/imgs/f0.jpg', // Queen's Hotel night / culinary / dining
  '/imgs/kandy-tooth-temple-illuminated-in-the-evening-title-photo_orig.jpg', // Sacred Tooth Temple
  '/imgs/maxresdefault.jpg', // Cityscape / tech / summit
  '/imgs/220A7822.jpg', // Bahirawakanda Buddha statue / spiritual
  '/imgs/kandy2.jpg', // Colonial architecture / civic / town hall
  '/imgs/temple-tooth-kandy-sri-lanka-sacred-relic-dalada-maligawa-buddhist-situated-world-heritage-site-41212812.jpg', // World Heritage / tour
  '/imgs/images.jpg', // General community / youth
];

// Returns an image contextually related to the event's title and description
export const getEventImage = (event) => {
  if (event?.imageUrl) return event.imageUrl;

  const text = `${event?.title || ''} ${event?.category || ''} ${event?.description || ''}`.toLowerCase();

  // 1. Cultural pageant / Perahera / traditional dance / procession
  if (text.match(/perahera|esala|dance|procession|pageant|drum|cultural|parade|costume|tradition/i)) {
    return '/imgs/images (1).jpg';
  }

  // 2. Lake / clean & green / nature / marathon / environment / park
  if (text.match(/lake|green|clean|drive|nature|marathon|walk|environment|water|tree|park|eco/i)) {
    return '/imgs/kandy-3.jpg';
  }

  // 3. Food / culinary / dining / street food / festival / feast
  if (text.match(/food|culinary|street food|dining|taste|feast|cook|fest|hospitality|night/i)) {
    return '/imgs/f0.jpg';
  }

  // 4. Temple of Tooth / sacred / dalada / maligawa / pooja / worship / relic
  if (text.match(/temple|tooth|relic|sacred|dalada|maligawa|pooja|worship|evening|prayer|shrine/i)) {
    return '/imgs/kandy-tooth-temple-illuminated-in-the-evening-title-photo_orig.jpg';
  }

  // 5. Buddha / Bahirawakanda / spiritual / peace / meditation / mountain
  if (text.match(/buddha|bahirawakanda|statue|spiritual|peace|meditation|hill top|monastery/i)) {
    return '/imgs/220A7822.jpg';
  }

  // 6. Technology / youth / summit / smart city / innovation / AI / digital
  if (text.match(/tech|technology|summit|smart|city|youth|digital|hackathon|innovation|software|computer/i)) {
    return '/imgs/maxresdefault.jpg';
  }

  // 7. Civic council / town hall / governance / colonial architecture / conference / seminar
  if (text.match(/council|civic|town hall|governance|colonial|conference|seminar|heritage|meeting/i)) {
    return '/imgs/kandy2.jpg';
  }

  // 8. World Heritage / tourism / sightseeing / tour
  if (text.match(/heritage|tour|tourism|history|ancient|unesco|sightseeing/i)) {
    return '/imgs/temple-tooth-kandy-sri-lanka-sacred-relic-dalada-maligawa-buddhist-situated-world-heritage-site-41212812.jpg';
  }

  // Stable fallback based on ID & Title hash
  const seed = (typeof event?.id === 'number' ? event.id * 17 : 0) +
    (event?.title ? event.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0);

  return EVENT_IMAGES[Math.abs(seed) % EVENT_IMAGES.length];
};

const getCategoryColor = (cat = '') => {
  const map = {
    cultural:         'bg-violet-600/80 text-violet-100 border border-violet-400/40',
    community:        'bg-emerald-600/80 text-emerald-100 border border-emerald-400/40',
    technology:       'bg-sky-600/80 text-sky-100 border border-sky-400/40',
    'food---festival':'bg-amber-600/80 text-amber-100 border border-amber-400/40',
    'food-&-festival':'bg-amber-600/80 text-amber-100 border border-amber-400/40',
    'sports---youth': 'bg-teal-600/80 text-teal-100 border border-teal-400/40',
    'sports-&-youth': 'bg-teal-600/80 text-teal-100 border border-teal-400/40',
    'civic-council':  'bg-indigo-600/80 text-indigo-100 border border-indigo-400/40',
  };
  const key = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return map[key] || 'bg-slate-700/80 text-slate-100 border border-slate-500/40';
};

const EventCard = ({ event, onRegister, onCancel, onDelete, isRegistered }) => {
  const { user, role } = useAuth();

  const isOwner = user && role === 'Organizer' && user.id === event.organizerId;
  const isParticipant = role === 'Participant';

  const startDateObj = new Date(event.startDate);
  const startDateStr = startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const startTimeStr = startDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const percentFull = Math.min(100, Math.round(((event.registeredCount || 0) / event.maxParticipants) * 100));
  const isFull = event.registeredCount >= event.maxParticipants;
  const hasPassed = new Date() >= new Date(event.startDate);

  const eventImage = getEventImage(event);

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* ── Event Image Banner with Lower Opacity & Subtle Vignette ── */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
        <img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/50" />

        {/* Top Badges: Category & Status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className={`backdrop-blur-md flex items-center gap-1.5 text-[0.72rem] font-bold px-3 py-1 rounded-full shadow-sm ${getCategoryColor(event.category)}`}>
            <Sparkles size={11} className="text-amber-300" /> {event.category}
          </span>

          {isRegistered ? (
            <span className="backdrop-blur-md flex items-center gap-1 text-[0.72rem] font-black px-3 py-1 rounded-full bg-emerald-500/90 text-white shadow-sm border border-emerald-300/40">
              <CheckCircle2 size={12} /> Registered
            </span>
          ) : hasPassed ? (
            <span className="backdrop-blur-md text-[0.72rem] font-bold px-3 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-white/20">
              Closed
            </span>
          ) : isFull ? (
            <span className="backdrop-blur-md text-[0.72rem] font-bold px-3 py-1 rounded-full bg-rose-600/90 text-white shadow-sm border border-rose-300/40">
              Full Capacity
            </span>
          ) : (
            <span className="backdrop-blur-md text-[0.72rem] font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400/40">
              ● Open
            </span>
          )}
        </div>

        {/* Floating Quick Location snippet at bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-slate-200 truncate">
          <MapPin size={14} className="text-amber-400 shrink-0" />
          <span className="truncate drop-shadow-md">{event.location}</span>
        </div>
      </div>

      {/* ── Card Content Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-outfit font-bold text-[1.15rem] leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300"><strong>{startDateStr}</strong> at {startTimeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Organizer: <strong className="text-slate-700 dark:text-slate-300">{event.organizerName}</strong></span>
          </div>
        </div>

        {/* Capacity Progress */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
              <Users size={13} className="text-indigo-500" /> Capacity
            </span>
            <span className={`font-bold ${isFull ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
              {event.registeredCount || 0} / {event.maxParticipants} ({percentFull}%)
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`progress-bar-fill h-full ${isFull ? 'full' : ''}`} style={{ width: `${percentFull}%` }} />
          </div>
        </div>
      </div>

      {/* ── Card Footer Actions ── */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-white/10 gap-2 flex-wrap">
        <Link to={`/events/${event.id}`}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 hover:border-indigo-400 no-underline transition-all duration-150 shadow-sm">
          Details <ArrowRight size={13} />
        </Link>

        {isOwner && (
          <div className="flex gap-1.5">
            <Link to={`/organizer/events/${event.id}/edit`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 no-underline transition-all duration-150">
              <Edit3 size={13} /> Edit
            </Link>
            <button
              onClick={() => onDelete && onDelete(event.id)}
              title="Delete Event"
              className="flex items-center justify-center w-7 h-7 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/25 border-0 cursor-pointer transition-all duration-150">
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {isParticipant && (
          isRegistered ? (
            <button
              onClick={() => onCancel && onCancel(event.id)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-red-400/40 text-red-500 dark:text-red-400 hover:bg-red-400/10 bg-transparent cursor-pointer transition-all duration-150">
              Cancel Registration
            </button>
          ) : (
            <button
              onClick={() => onRegister && onRegister(event.id)}
              disabled={isFull || hasPassed}
              className="px-4 py-1.5 text-xs font-bold rounded-xl text-white cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border-0 shadow-sm hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
              {hasPassed ? 'Ended' : isFull ? 'Full' : 'Register Now'}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EventCard;
