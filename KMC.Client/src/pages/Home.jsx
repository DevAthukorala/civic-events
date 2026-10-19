import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Sparkles, Filter, Calendar } from 'lucide-react';

const HERO_SLIDES = [
  { src: '/imgs/kandy-3.jpg', caption: 'Kandy Lake at dawn — the heart of the Sacred City' },
  { src: '/imgs/images (1).jpg', caption: 'Esala Perahera — the grandest cultural pageant in Sri Lanka' },
  { src: '/imgs/maxresdefault.jpg', caption: "Sri Lanka's hill capital, nestled in lush mountains" },
  { src: '/imgs/kandy-tooth-temple-illuminated-in-the-evening-title-photo_orig.jpg', caption: 'Temple of the Sacred Tooth Relic — illuminated at dusk' },
];

const GALLERY_ITEMS = [
  { src: '/imgs/kandy-3.jpg', caption: 'Kandy Lake' },
  { src: '/imgs/images (1).jpg', caption: 'Esala Perahera' },
  { src: '/imgs/f0.jpg', caption: "Queen's Hotel Night" },
  { src: '/imgs/220A7822.jpg', caption: 'Bahirawakanda Buddha' },
  { src: '/imgs/kandy2.jpg', caption: "Queen's Hotel" },
  { src: '/imgs/maxresdefault.jpg', caption: 'Kandy Cityscape' },
  { src: '/imgs/kandy-tooth-temple-illuminated-in-the-evening-title-photo_orig.jpg', caption: 'Tooth Temple' },
  { src: '/imgs/temple-tooth-kandy-sri-lanka-sacred-relic-dalada-maligawa-buddhist-situated-world-heritage-site-41212812.jpg', caption: 'Temple & Lake' },
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimerRef = useRef(null);

  const { isAuthenticated, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Cultural', 'Community', 'Technology', 'Food & Festival', 'Sports & Youth', 'Civic Council'];

  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimerRef.current);
  }, []);

  const goToSlide = (idx) => {
    clearInterval(slideTimerRef.current);
    setCurrentSlide(idx);
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated && role === 'Participant') fetchMyRegistrations();
  }, [isAuthenticated, role]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get('/registrations/my');
      setMyRegistrations(res.data);
    } catch (err) {
      console.error('Failed to load user registrations', err);
    }
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) { showToast('Please login to register for events.', 'info'); navigate('/login'); return; }
    if (role !== 'Participant') { showToast('Only participants can register for events.', 'error'); return; }
    try {
      await api.post('/registrations', { eventId });
      showToast('Successfully registered for the event!', 'success');
      fetchEvents(); fetchMyRegistrations();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to register.', 'error'); }
  };

  const handleCancelRegistration = async (eventId) => {
    const reg = myRegistrations.find((r) => r.eventId === eventId && r.status === 'Registered');
    if (!reg) return;
    try {
      await api.delete(`/registrations/${reg.id}`);
      showToast('Registration cancelled.', 'info');
      fetchEvents(); fetchMyRegistrations();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to cancel registration.', 'error'); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      showToast('Event deleted successfully.', 'success');
      fetchEvents();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete event.', 'error'); }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery = !searchQuery || ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) || ev.description?.toLowerCase().includes(searchQuery.toLowerCase()) || ev.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);

  return (
    <div className="flex-1 bg-surface-app dark:bg-surface-dark-app">
      {/* ── Hero Banner with Slideshow ── */}
      <section className="relative h-[580px] overflow-hidden flex items-center justify-center">
        {/* Background slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.src}')` }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(9,13,30,0.88) 0%, rgba(30,27,75,0.82) 50%, rgba(79,70,229,0.55) 100%)' }} />

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 text-[0.8rem] font-bold px-4 py-1.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 mb-6">
            <Sparkles size={16} className="text-yellow-400" /> Kandy Municipal Council Official Portal
          </div>

          <h1 className="font-outfit font-black text-5xl leading-tight mb-5">
            Discover &amp; Experience <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}>
              Events in the Sacred City
            </span>
          </h1>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            From cultural pageants at the Temple Square to community green initiatives and civic seminars, connect directly with official events across Kandy.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-3 glass rounded-2xl border border-white/20 px-4 py-2 max-w-2xl mx-auto mb-8"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Search size={18} className="text-slate-300 shrink-0" />
            <input
              type="text"
              placeholder="Search events by title, keyword, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 text-sm focus:outline-none"
            />
            <button onClick={() => navigate('/search')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-0 hover:opacity-90 transition-all shrink-0"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' }}>
              <Filter size={15} /> Advanced Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="font-outfit font-black text-3xl text-white">{events.length}</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Active Events</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="text-center">
              <div className="font-outfit font-black text-3xl text-white">{totalRegistrations}</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Citizen Registrations</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="text-center">
              <div className="font-outfit font-black text-3xl text-white">100%</div>
              <div className="text-slate-400 text-xs font-semibold mt-0.5">Verified Council Events</div>
            </div>
          </div>

          {/* Slide dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {HERO_SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => goToSlide(idx)} aria-label={`Go to slide ${idx + 1}`}
                className={`rounded-full border-0 cursor-pointer transition-all duration-300 ${idx === currentSlide ? 'w-8 h-2.5 bg-yellow-400' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content area */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* Gallery strip */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[0.78rem] font-bold text-slate-400 uppercase tracking-widest">📍 Explore Kandy</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="gallery-strip">
            {GALLERY_ITEMS.map((item, idx) => (
              <div className="gallery-strip-item" key={idx}>
                <img src={item.src} alt={item.caption} loading="lazy" />
                <div className="gallery-strip-caption">{item.caption}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Events section */}
        <section>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="flex items-center gap-2 font-outfit font-black text-2xl text-slate-900 dark:text-slate-100 mb-1">
                <Calendar size={26} className="text-indigo-500" /> Upcoming Municipal Events
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Showing {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}{' '}
                {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'across all categories'}
              </p>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border cursor-pointer transition-all duration-150
                    ${selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-glow'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/15 hover:border-indigo-400 hover:text-indigo-500'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 text-indigo-500 font-semibold text-lg">
                <Sparkles size={20} className="spin-animation" /> Loading KMC events...
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-xl2 border border-slate-200 dark:border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="font-outfit font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">No events found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 text-sm">
                We couldn't find any events matching your selected category or search keywords.
              </p>
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/20 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer bg-transparent transition-all">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {filteredEvents.map((ev) => {
                const isReg = myRegistrations.some((r) => r.eventId === ev.id && r.status === 'Registered');
                return (
                  <EventCard key={ev.id} event={ev} isRegistered={isReg}
                    onRegister={handleRegister} onCancel={handleCancelRegistration} onDelete={handleDeleteEvent} />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
