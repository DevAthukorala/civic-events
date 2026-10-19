import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 text-slate-400 pt-14 pb-7 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #080C15 100%)' }}>
      {/* Background texture */}
      <div className="footer-bg-image" />

      <div className="relative max-w-[1280px] mx-auto">
        <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>

          {/* About Column */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg text-[0.85rem] font-black text-white font-outfit shrink-0"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #8B5CF6 100%)' }}>
                KMC
              </div>
              <div>
                <div className="text-white font-outfit font-black text-[1.1rem] leading-none">Kandy Municipal Council</div>
                <div className="text-yellow-400 text-[0.72rem] font-semibold mt-0.5">Official Civic Event Platform</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering citizens and visitors with seamless event registration, heritage showcases, and civic activities across the Sacred City of Kandy.
            </p>

            {/* Kandy thumbnail strip */}
            <div className="flex gap-1.5 mt-4">
              {[
                '/imgs/kandy-3.jpg',
                '/imgs/images (1).jpg',
                '/imgs/f0.jpg',
                '/imgs/220A7822.jpg',
              ].map((src, i) => (
                <div key={i} className="w-[52px] h-[38px] rounded-md overflow-hidden border border-white/10 shrink-0">
                  <img src={src} alt="Kandy" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[0.95rem] font-bold mb-4 tracking-wide">Platform Navigation</h4>
            <ul className="list-none flex flex-col gap-2 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors no-underline">→ Browse All Events</Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-300 hover:text-white transition-colors no-underline">→ Search &amp; Filter</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors no-underline">→ Organizer Portal</Link>
              </li>
              <li>
                <a href="http://localhost:5000/swagger" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors no-underline">
                  <ExternalLink size={14} /> REST API / Swagger Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[0.95rem] font-bold mb-4 tracking-wide">Civic Office &amp; Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>Town Hall, City Centre, Kandy 20000, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-yellow-400 shrink-0" />
                <span>events@kmc.gov.lk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-yellow-400 shrink-0" />
                <span>+94 81 222 2223 / +94 81 223 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/8 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Kandy Municipal Council Event Hub. All rights reserved.</div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={15} className="text-emerald-400" />
            Service-Oriented Architecture (ASP.NET Core &amp; React)
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
