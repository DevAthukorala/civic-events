import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, User, Mail, KeyRound, Shield, Sparkles } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Participant');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await register(fullName, email, password, role);
      showToast(`Account created successfully! Welcome, ${user.fullName}.`, 'success');

      if (role === 'Organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/participant/my-registrations');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Kandy Perahera photo */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <img
          src="/imgs/images (1).jpg"
          alt="Esala Perahera festival procession in Kandy, Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(9,13,30,0.88) 0%, rgba(30,27,75,0.82) 50%, rgba(79,70,229,0.55) 100%)' }} />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 mb-5">
            <Sparkles size={12} /> Join the Community
          </div>
          <h2 className="font-outfit text-4xl font-black mb-3 leading-tight">Be Part of<br />Kandy's Heritage</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            Register to discover and join official civic events, cultural festivals, and community programmes in the Sacred City of Kandy.
          </p>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-surface-app dark:bg-surface-dark-app">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl font-outfit font-black text-xl text-white mb-5"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)', boxShadow: '0 0 20px rgba(79,70,229,0.4)' }}>
              KMC
            </div>
            <h2 className="font-outfit text-3xl font-black text-slate-900 dark:text-slate-100 mb-1">Create KMC Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Join the Kandy Municipal Council Event Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <input type="text" placeholder="e.g. Kasun Perera" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

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
                <input type="password" placeholder="At least 6 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Role Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => setRole('Participant')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                    ${role === 'Participant'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 hover:border-indigo-400'}`}>
                  <Shield size={22} className={role === 'Participant' ? 'text-indigo-500' : 'text-slate-400'} />
                  <div className="text-center">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Citizen / Participant</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Browse &amp; register for events</div>
                  </div>
                </div>
                <div onClick={() => setRole('Organizer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                    ${role === 'Organizer'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 hover:border-indigo-400'}`}>
                  <User size={22} className={role === 'Organizer' ? 'text-indigo-500' : 'text-slate-400'} />
                  <div className="text-center">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Council Organizer</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Publish &amp; manage events</div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm mt-1 cursor-pointer border-0 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
              <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-400 no-underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
