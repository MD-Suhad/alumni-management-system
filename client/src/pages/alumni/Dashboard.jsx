import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import {
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AlumniDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, memRes] = await Promise.all([
          api.get('/events/registrations/me'),
          api.get('/memberships/my').catch(() => ({ data: { data: [] } }))
        ]);
        setRegistrations(regRes.data.data || []);
        setMemberships(memRes.data.data || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isApproved = user?.status === 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Welcome & Status Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || '')}&background=1e3a8a&color=fff`}
            alt={user?.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.fullName}</h1>
              {isApproved && (
                <span className="p-1 rounded-full bg-emerald-50 text-emerald-600" title="Verified Graduate">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  user?.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                Verification: {user?.status}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                Role: {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div>
          <Link
            to="/profile"
            className="inline-flex items-center bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile & Privacy
          </Link>
        </div>
      </div>

      {!isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-800 font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-amber-900">Academic Verification Pending Review</p>
            <p className="mt-0.5">
              The alumni office is verifying your student registration records. While in review, directory browsing and voting are restricted. You may still view upcoming events and update your profile.
            </p>
          </div>
        </div>
      )}

      {/* Grid: My Registered Events / Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-brand-600" />
              My Event Passes ({registrations.length})
            </h2>
            <Link to="/events" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Browse More Events →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="sm" />
          ) : registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wide">
                      {reg.event?.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{reg.event?.title}</h3>
                    <p className="text-xs text-slate-500">
                      {new Date(reg.event?.startTime).toLocaleDateString()} • {reg.event?.location?.venue}
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-700 pt-1">Ticket: {reg.ticketNumber}</p>
                  </div>

                  {reg.qrCodeString && (
                    <div className="text-center shrink-0 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <img src={reg.qrCodeString} alt="QR Code" className="w-20 h-20 mx-auto" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Scan at Entry</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              You have not registered for any upcoming events.
            </div>
          )}
        </div>

        {/* Memberships & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-brand-600" />
            Association Membership
          </h2>

          <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">Active Plan</span>
                <h3 className="text-xl font-extrabold mt-0.5">General Graduate Member</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enjoys lifelong directory access, networking privileges, and eligibility to attend all national and regional chapter gatherings.
            </p>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-slate-400">Upgrade to Life Member</span>
              <button
                onClick={() => alert('Life membership renewal portal active during annual general meeting.')}
                className="font-bold text-gold-400 hover:text-gold-300"
              >
                Apply for Upgrade →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
