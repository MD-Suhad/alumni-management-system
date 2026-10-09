import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  Briefcase,
  CreditCard,
  Download,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const response = await api.get('/admin/reports/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'alumni-registry.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV report.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading administrative metrics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Administrative Control</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Alumni Association Executive Portal</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-300 text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2 text-slate-500" />
            {exporting ? 'Generating CSV...' : 'Export Directory (CSV)'}
          </button>
          <Link
            to="/admin/pending"
            className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Review Pending Queue ({stats?.pendingVerifications || 0})
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats?.totalUsers || 0}</p>
          <p className="text-xs font-bold text-slate-500">Registered Users</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{stats?.approvedAlumni || 0}</p>
          <p className="text-xs font-bold text-slate-500">Verified Alumni</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{stats?.pendingVerifications || 0}</p>
          <p className="text-xs font-bold text-slate-500">Pending Review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats?.totalEvents || 0}</p>
          <p className="text-xs font-bold text-slate-500">Events Hosted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats?.activeJobs || 0}</p>
          <p className="text-xs font-bold text-slate-500">Active Jobs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats?.totalMemberships || 0}</p>
          <p className="text-xs font-bold text-slate-500">Paid Members</p>
        </div>
      </div>

      {/* Admin Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verification Alert Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-amber-600">
            <Clock className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-900">Alumni Accreditation Queue</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            There are currently <strong>{stats?.pendingVerifications || 0}</strong> graduates awaiting academic accreditation. Verified members receive directory listing and access to elections.
          </p>
          <div className="pt-2">
            <Link
              to="/admin/pending"
              className="inline-flex items-center text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2.5 rounded-xl transition-colors"
            >
              Open Accreditation Review Queue <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Security & Audit Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-brand-600">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-900">System Governance & Audit Logs</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            All administrative actions, membership approvals, and system state modifications are tracked with cryptographic timestamps and IP address origin logging.
          </p>
          <div className="pt-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Audit Engine Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
