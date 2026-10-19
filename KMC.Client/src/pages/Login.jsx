import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, KeyRound, Mail, Sparkles, Shield, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');

      if (user.role === 'Organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/participant/my-registrations');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'organizer') {
      setEmail('organizer@kmc.gov.lk');
      setPassword('Password123!');
    } else {
      setEmail('perera@gmail.com');
      setPassword('Password123!');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Kandy night photo */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <img
          src="/imgs/kandy-tooth-temple-illuminated-in-the-evening-title-photo_orig.jpg"
          alt="Temple of the Sacred Tooth Relic illuminated at night, Kandy, Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(9,13,30,0.88) 0%, rgba(30,27,75,0.82) 50%, rgba(79,70,229,0.55) 100%)' }} />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 mb-5">
            <Sparkles size={12} /> Sacred City Portal
          </div>
          <h2 className="font-outfit text-4xl font-black mb-3 leading-tight">Welcome to<br />Kandy Event Hub</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            The official digital gateway to Kandy Municipal Council civic events, heritage showcases &amp; community programmes.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-surface-app dark:bg-surface-dark-app">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl font-outfit font-black text-xl text-white mb-5"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)', boxShadow: '0 0 20px rgba(79,70,229,0.4)' }}>
              KMC
            </div>
            <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-slate-100 mb-1">Sign In to KMC Hub</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Access municipal event management &amp; citizen registrations</p>
          </div>

          {/* Demo Fast-fill banner */}
          <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/8 p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-3">
              <Sparkles size={16} /> Quick Demo One-Click Fill:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleDemoFill('organizer')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer transition-all duration-150">
                <User size={14} className="text-indigo-500" /> Organizer Demo
              </button>
              <button type="button" onClick={() => handleDemoFill('participant')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer transition-all duration-150">
                <Shield size={14} className="text-sky-500" /> Citizen Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <input type="email" placeholder="name@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm mt-1 cursor-pointer border-0 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
              <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-500 font-bold hover:text-indigo-400 no-underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
