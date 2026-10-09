import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Briefcase, Globe, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editable fields state
  const [formData, setFormData] = useState({
    currentCompany: '',
    designation: '',
    industry: '',
    city: '',
    country: 'Bangladesh',
    bloodGroup: 'Unknown',
    bio: '',
    linkedin: '',
    github: '',
    phone: '',
    showEmail: false,
    showPhone: false,
    showCurrentCompany: true,
    showBloodGroup: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/alumni/profile');
        const p = res.data.data;
        setProfile(p);
        setFormData({
          currentCompany: p.currentCompany || '',
          designation: p.designation || '',
          industry: p.industry || '',
          city: p.location?.city || '',
          country: p.location?.country || 'Bangladesh',
          bloodGroup: p.bloodGroup || 'Unknown',
          bio: p.bio || '',
          linkedin: p.socialLinks?.linkedin || '',
          github: p.socialLinks?.github || '',
          phone: p.user?.phone || '',
          showEmail: p.privacySettings?.showEmail || false,
          showPhone: p.privacySettings?.showPhone || false,
          showCurrentCompany: p.privacySettings?.showCurrentCompany !== false,
          showBloodGroup: p.privacySettings?.showBloodGroup !== false
        });
      } catch (err) {
        setErrorMsg('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      await api.put('/alumni/profile', {
        currentCompany: formData.currentCompany,
        designation: formData.designation,
        industry: formData.industry,
        location: {
          city: formData.city,
          country: formData.country
        },
        bloodGroup: formData.bloodGroup,
        bio: formData.bio,
        phone: formData.phone,
        socialLinks: {
          linkedin: formData.linkedin,
          github: formData.github
        },
        privacySettings: {
          showEmail: formData.showEmail,
          showPhone: formData.showPhone,
          showCurrentCompany: formData.showCurrentCompany,
          showBloodGroup: formData.showBloodGroup
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Alumni Profile & Privacy</h1>
        <p className="text-slate-600 mt-1">Manage your public information and configure visibility controls.</p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and privacy preferences saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Overview (Read-Only Verification fields) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-brand-600" />
            Verified Academic Records (Locked)
          </h2>
          <p className="text-xs text-slate-500">Official credentials verified against university registrar records.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Student ID</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.studentId}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Department</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.department?.name || 'CSE'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Class of</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.graduationYear}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Degree</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{profile?.degree}</p>
            </div>
          </div>
        </div>

        {/* Career & Contact Information */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-brand-600" />
            Current Employment & Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Microsoft, Local Firm"
                value={formData.currentCompany}
                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Title</label>
              <input
                type="text"
                placeholder="e.g. Lead Engineer, Managing Director"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Personal Bio</label>
              <textarea
                rows="3"
                placeholder="Tell fellow alumni about your professional journey and areas of interest..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Directory Privacy Preferences */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-brand-600" />
            Granular Directory Privacy Controls
          </h2>
          <p className="text-xs text-slate-500">
            Control which fields other verified alumni can see when browsing the directory.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.showEmail}
                onChange={(e) => setFormData({ ...formData, showEmail: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Show Email in Directory</p>
                <p className="text-[11px] text-slate-500">Allow other alumni to view your contact email.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.showPhone}
                onChange={(e) => setFormData({ ...formData, showPhone: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Show Phone Number</p>
                <p className="text-[11px] text-slate-500">Allow other verified alumni to view your telephone number.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.showCurrentCompany}
                onChange={(e) => setFormData({ ...formData, showCurrentCompany: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Show Current Company & Designation</p>
                <p className="text-[11px] text-slate-500">Display your workplace on your directory card.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl shadow text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving Preferences...' : 'Save Profile & Privacy Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
