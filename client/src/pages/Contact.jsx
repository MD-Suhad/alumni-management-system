import React, { useState } from 'react';
import api from '../lib/axios';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Alumni Secretariat</h1>
        <p className="text-slate-600 text-sm">
          Have questions regarding membership dues, reunion sponsorship, or academic record accreditation? Reach out to our executive office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Office Information</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Our central secretariat is open Sunday through Thursday from 9:00 AM to 5:00 PM (GMT+6).
            </p>
          </div>

          <div className="space-y-6 text-sm">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                <MapPin className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-bold text-white">Campus Headquarters</p>
                <p className="text-xs text-slate-300 mt-0.5">Alumni Bhaban, Central University Campus, University Avenue</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                <Mail className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-bold text-white">Email Communications</p>
                <p className="text-xs text-slate-300 mt-0.5">alumni-office@university.edu</p>
                <p className="text-xs text-slate-400">verification@alumni.university.edu</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                <Phone className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-bold text-white">Secretariat Telephone</p>
                <p className="text-xs text-slate-300 mt-0.5">+880 (2) 966-1920 Ext. 401</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">Send an Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">We typically respond to inquiries within 1-2 business days.</p>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received by the secretariat.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                required
                type="text"
                name="subject"
                placeholder="e.g. Life Membership Inquiry / Batch 12 Reunion"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows="5"
                name="message"
                placeholder="Write your message or inquiry here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Transmitting Message...' : 'Send Inquiry to Secretariat'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
