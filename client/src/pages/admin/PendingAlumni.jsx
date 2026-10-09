import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { UserCheck, UserX, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const PendingAlumni = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/alumni/pending');
      setPendingList(res.data.data?.data || []);
    } catch (err) {
      setPendingList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    setActionLoading(userId);
    setMessage('');
    try {
      let rejectionReason = '';
      if (newStatus === 'rejected') {
        rejectionReason = prompt('Please provide reason for rejecting this alumni record:') || 'Verification credentials mismatch';
      }

      await api.patch(`/admin/alumni/${userId}/status`, {
        status: newStatus,
        rejectionReason
      });

      setMessage(`Alumni record successfully updated to ${newStatus}.`);
      setPendingList((prev) => prev.filter((item) => item._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update alumni status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center space-x-3">
        <Link to="/admin" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Alumni Verification Queue</h1>
          <p className="text-xs text-slate-500">Cross-reference applicant graduation roll numbers with university records.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Fetching pending registrations..." />
      ) : pendingList.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Student ID / Roll</th>
                  <th className="px-6 py-4">Department & Class</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{item.firstName} {item.lastName}</p>
                        <p className="text-xs text-slate-400">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {item.profile?.studentId || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{item.profile?.department?.name || 'Department'}</p>
                      <p className="text-xs text-slate-500">Class of {item.profile?.graduationYear}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'approved')}
                          disabled={actionLoading === item._id}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'rejected')}
                          disabled={actionLoading === item._id}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-200 disabled:opacity-50"
                        >
                          <UserX className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Accreditation Queue is Clear</h3>
          <p className="text-xs">There are no pending alumni registrations awaiting administrative verification.</p>
        </div>
      )}
    </div>
  );
};
