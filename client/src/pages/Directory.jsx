import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MapPin, Building, GraduationCap, Linkedin, Mail, Phone, Lock } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const Directory = () => {
  const { user, isApprovedAlumni } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // Fetch metadata departments
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get('/metadata');
        setDepartments(res.data.data.departments || []);
      } catch (err) {}
    };
    fetchMetadata();
  }, []);

  // Fetch Directory Profiles
  const fetchDirectory = async (page = 1) => {
    if (!isApprovedAlumni) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(search && { search }),
        ...(selectedDept && { department: selectedDept }),
        ...(gradYear && { graduationYear: gradYear }),
        ...(bloodGroup && { bloodGroup })
      });
      const res = await api.get(`/alumni/directory?${params.toString()}`);
      setProfiles(res.data.data.data || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory(1);
  }, [selectedDept, gradYear, bloodGroup, isApprovedAlumni]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDirectory(1);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 space-y-5">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Alumni Directory is Protected</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            To respect member privacy, the full alumni directory is exclusive to verified university graduates. Please log in or register.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <Link to="/login" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl shadow">
              Log In
            </Link>
            <Link to="/register" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl">
              Register as Alumni
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user && !isApprovedAlumni) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-amber-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Account Pending Verification</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Thank you for verifying your email. Your academic record is currently under administrative review by the alumni committee. Once approved, full directory access will be unlocked.
          </p>
          <Link to="/profile" className="inline-block bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl">
            Check Profile Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Alumni Directory</h1>
        <p className="text-slate-600 mt-1">Connect with verified graduates across all batches and academic faculties.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by company, designation, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-700 bg-white"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <input
              type="number"
              placeholder="Grad Year"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingSpinner text="Searching verified alumni..." />
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-6 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={p.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user?.firstName + ' ' + p.user?.lastName)}&background=1e3a8a&color=fff`}
                  alt={p.user?.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {p.user?.firstName} {p.user?.lastName}
                  </h3>
                  <div className="flex items-center text-xs font-semibold text-brand-600 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 mr-1" />
                    <span>{p.department?.code} • Class of {p.graduationYear}</span>
                  </div>
                  {p.currentCompany && (
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span className="truncate">{p.designation} at {p.currentCompany}</span>
                    </div>
                  )}
                </div>
              </div>

              {p.bio && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{p.bio}"
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {p.location?.city || 'Dhaka'}, {p.location?.country || 'Bangladesh'}
                </span>
                {p.socialLinks?.linkedin && (
                  <a
                    href={p.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:text-brand-800 p-1.5 rounded-lg hover:bg-brand-50"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
          No alumni profiles found matching your search criteria.
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => fetchDirectory(pg)}
              className={`w-10 h-10 rounded-xl font-bold text-sm ${
                pagination.page === pg
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
