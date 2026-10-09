import React from 'react';
import { Award, Users, BookOpen, ShieldCheck } from 'lucide-react';

export const About = () => {
  const committee = [
    {
      name: 'Engr. Mahbubur Rahman',
      role: 'President',
      dept: 'CSE, Batch 92',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Managing Director at Apex Tech and former faculty member.'
    },
    {
      name: 'Dr. Shahana Parveen',
      role: 'Vice President',
      dept: 'EEE, Batch 95',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Dean of Engineering and leading renewable energy researcher.'
    },
    {
      name: 'Tanvir Ahmed',
      role: 'General Secretary',
      dept: 'ME, Batch 98',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Entrepreneur, philanthropist, and founder of GreenVenture.'
    },
    {
      name: 'Nusrat Jahan',
      role: 'Treasurer',
      dept: 'CE, Batch 02',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      bio: 'Partner at National Infrastructure Advisory.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">About the Association</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Preserving Legacy, Empowering Futures</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Founded in 1985, the University Alumni Association represents over 25,000 graduates across the globe. Our mission is to promote lifelong professional brotherhood, academic research, and social philanthropy.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Lifelong Networking</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Connecting graduates across five continents for professional mentorship, venture collaborations, and social reunions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Scholarships & Grants</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Over 5 Million BDT granted annually in need-based scholarships and student research funding for underprivileged scholars.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Institutional Governance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Operating under an elected executive council, maintaining strict fiscal accountability, verified accreditation, and transparent elections.
          </p>
        </div>
      </div>

      {/* Executive Committee */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Executive Committee</h2>
          <p className="text-slate-500 text-sm mt-1">Elected leaders serving the Alumni Association for the 2024–2026 tenure.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {committee.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-6 text-center space-y-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-brand-500 shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wide">{member.role}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{member.dept}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
