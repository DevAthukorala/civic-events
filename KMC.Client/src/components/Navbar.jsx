import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import {
  Calendar,
  Search,
  LayoutDashboard,
  BookmarkCheck,
  LogOut,
  LogIn,
  UserPlus,
  PlusCircle,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#0b0820]/60 via-[#1f103d]/45 to-[#0e0a2b]/60 border-b border-purple-500/20 shadow-lg shadow-purple-950/20 transition-all duration-300">
      {/* Luminous purple-amber accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500/40 via-violet-400/70 to-purple-500/40 opacity-80" />

      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl font-black text-xs text-white font-outfit shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform duration-200"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #F59E0B 100%)' }}>
            <span>KMC</span>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-400 opacity-30 blur-sm -z-10 group-hover:opacity-60 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-outfit font-black text-lg tracking-tight leading-none group-hover:text-amber-300 transition-colors">
                Kandy Event Hub
              </span>
              <span className="inline-flex items-center gap-0.5 text-[0.65rem] font-bold px-1.5 py-0.2 text-amber-300 bg-amber-400/15 rounded border border-amber-400/30">
                <Sparkles size={9} /> Official
              </span>
            </div>
            <div className="text-purple-200/80 text-[0.7rem] font-medium leading-none mt-1">
              Kandy Municipal Council
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center gap-1.5 list-none m-0 p-0">
            <li>
              <Link to="/"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive('/') 
                    ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-400/40 shadow-sm shadow-purple-500/20' 
                    : 'text-purple-100/80 hover:text-white hover:bg-purple-500/15'}`}>
                <Calendar size={16} className={isActive('/') ? 'text-amber-400' : 'text-purple-400'} /> Browse Events
              </Link>
            </li>
            <li>
              <Link to="/search"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive('/search') 
                    ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-400/40 shadow-sm shadow-purple-500/20' 
                    : 'text-purple-100/80 hover:text-white hover:bg-purple-500/15'}`}>
                <Search size={16} className={isActive('/search') ? 'text-amber-400' : 'text-purple-400'} /> Search &amp; Filter
              </Link>
            </li>

            {/* Organizer Links */}
            {isAuthenticated && role === 'Organizer' && (
              <>
                <li>
                  <Link to="/organizer/dashboard"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                      ${isActive('/organizer/dashboard') 
                        ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-400/40 shadow-sm shadow-purple-500/20' 
                        : 'text-purple-100/80 hover:text-white hover:bg-purple-500/15'}`}>
                    <LayoutDashboard size={16} className={isActive('/organizer/dashboard') ? 'text-amber-400' : 'text-purple-400'} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/my-events"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                      ${isActive('/organizer/my-events') 
                        ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-400/40 shadow-sm shadow-purple-500/20' 
                        : 'text-purple-100/80 hover:text-white hover:bg-purple-500/15'}`}>
                    <Calendar size={16} className={isActive('/organizer/my-events') ? 'text-amber-400' : 'text-purple-400'} /> My Events
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/events/new"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-950 no-underline transition-all duration-200 hover:scale-105 shadow-md shadow-amber-500/25"
                    style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)' }}>
                    <PlusCircle size={16} /> Create Event
                  </Link>
                </li>
              </>
            )}

            {/* Participant Links */}
            {isAuthenticated && role === 'Participant' && (
              <li>
                <Link to="/participant/my-registrations"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                    ${isActive('/participant/my-registrations') 
                      ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white border border-purple-400/40 shadow-sm shadow-purple-500/20' 
                      : 'text-purple-100/80 hover:text-white hover:bg-purple-500/15'}`}>
                  <BookmarkCheck size={16} className={isActive('/participant/my-registrations') ? 'text-amber-400' : 'text-purple-400'} /> My Registrations
                </Link>
              </li>
            )}

            {/* Theme Toggle */}
            <li className="ml-1">
              <button
                type="button"
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle color theme"
                className="flex items-center justify-center w-10 h-10 rounded-xl text-purple-200 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all duration-150 cursor-pointer">
                {isDark ? <Sun size={18} className="text-amber-400 animate-pulse" /> : <Moon size={18} className="text-purple-300" />}
              </button>
            </li>

            {/* Auth Actions */}
            {!isAuthenticated ? (
              <li className="flex gap-2 ml-2">
                <Link to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white border border-purple-400/30 bg-purple-950/40 hover:bg-purple-900/60 no-underline transition-all duration-150">
                  <LogIn size={15} /> Login
                </Link>
                <Link to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white no-underline transition-all duration-200 hover:opacity-95 shadow-md shadow-purple-500/30 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #4F46E5 100%)' }}>
                  <UserPlus size={15} /> Register
                </Link>
              </li>
            ) : (
              <li className="flex items-center gap-3 ml-2 pl-2 border-l border-purple-500/30">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-white leading-tight">{user?.fullName}</span>
                  <span className={`text-[0.65rem] font-extrabold px-2 py-0.5 rounded-full mt-0.5 ${
                    role === 'Organizer' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-purple-400/20 text-purple-200 border border-purple-400/30'
                  }`}>{role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/25 transition-all duration-150 cursor-pointer">
                  <LogOut size={15} />
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
