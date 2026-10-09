import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-brand-700 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6 text-gold-400" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                ALUMNI<span className="text-brand-400">PORTAL</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Fostering lifelong connections, empowering future generations, and preserving our university's timeless legacy.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/directory" className="hover:text-white transition-colors">Alumni Directory</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Reunions & Events</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">Career Opportunities</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">News & Announcements</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Executive Committee</Link></li>
            </ul>
          </div>

          {/* Col 3: Membership & Programs */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Membership</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Register as Graduate</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Life Membership Program</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Constitution & By-Laws</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Scholarship Endowment</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Association Secretariat</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span>Alumni Bhaban, Central Campus, University Avenue</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                <span>alumni-office@university.edu</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                <span>+880 (2) 966-1920 Ext. 401</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} University Alumni Association. All rights reserved.</p>
          <p className="flex items-center mt-4 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> for University Graduates worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
