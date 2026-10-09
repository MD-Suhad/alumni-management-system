import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Clock, Plus, ExternalLink, X, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Jobs = () => {
  const { user, isApprovedAlumni } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Post Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    city: 'Dhaka',
    isRemote: false,
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: 'Negotiable',
    description: '',
    applicationUrl: '',
    deadline: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data.data?.data || []);
    } catch (err) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/jobs', {
        ...jobForm,
        location: {
          city: jobForm.city,
          isRemote: jobForm.isRemote
        }
      });
      setFormSuccess(true);
      setTimeout(() => {
        setPostModalOpen(false);
        setFormSuccess(false);
        fetchJobs();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit job opportunity.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Alumni Career Board</h1>
          <p className="text-slate-600 mt-1">Exclusive career opportunities shared by university alumni and partner organizations.</p>
        </div>

        {isApprovedAlumni && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post an Opportunity
          </button>
        )}
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <LoadingSpinner text="Fetching opportunities..." />
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-100">
                    {job.employmentType}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                    {job.experienceLevel}
                  </span>
                  {job.location?.isRemote && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                      Remote Available
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <p className="text-sm font-semibold text-slate-600">{job.company}</p>
                </div>

                <div className="flex flex-wrap items-center text-xs text-slate-500 gap-4">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.location?.city || 'Dhaka'}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.salaryRange}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>
              </div>

              <div className="flex md:flex-col items-center justify-end shrink-0">
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-colors"
                >
                  Apply Now
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
          No job openings posted at this moment.
        </div>
      )}

      {/* Post a Job Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPostModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {formSuccess ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Job Opportunity Submitted!</h3>
                <p className="text-xs text-slate-500">Your posting has been submitted for moderation review.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Post a Career Opportunity</h3>
                  <p className="text-xs text-slate-500">Share hiring openings at your company with fellow alumni.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Google, Banglalink"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={jobForm.employmentType}
                      onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location City</label>
                    <input
                      type="text"
                      placeholder="e.g. Dhaka, Singapore"
                      value={jobForm.city}
                      onChange={(e) => setJobForm({ ...jobForm, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Application URL</label>
                    <input
                      required
                      type="url"
                      placeholder="https://company.com/apply"
                      value={jobForm.applicationUrl}
                      onChange={(e) => setJobForm({ ...jobForm, applicationUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
                    <input
                      required
                      type="date"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Responsibilities</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Provide overview of duties and qualifications..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setPostModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
