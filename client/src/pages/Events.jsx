import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Ticket, CheckCircle2, X } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Events = () => {
  const { user, isApprovedAlumni } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states for RSVP
  const [guestsCount, setGuestsCount] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events?status=${activeTab}`);
      setEvents(res.data.data?.data || []);
    } catch (err) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post(`/events/${selectedEvent._id}/register`, {
        guestsCount: parseInt(guestsCount, 10),
        dietaryNotes
      });
      setRsvpSuccess(res.data.data);
      fetchEvents(); // refresh seat counters
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Alumni Events & Reunions</h1>
          <p className="text-slate-600 mt-1">Connect, celebrate, and expand your professional circle.</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'upcoming' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'past' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Archives
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => {
            const seatsRemaining = evt.capacity - evt.registeredCount;
            const isFull = seatsRemaining <= 0;

            return (
              <div key={evt._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={evt.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-brand-900/90 text-white backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold">
                      {evt.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-brand-600" />
                        {new Date(evt.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {evt.location?.venue}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{evt.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{evt.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold pt-3">
                    <span className="text-slate-500 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-slate-400" />
                      {evt.registeredCount} / {evt.capacity} registered
                    </span>
                    <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isFull ? 'Sold Out' : `${seatsRemaining} seats left`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900">
                      {evt.ticketPrice === 0 ? 'Free Entry' : `${evt.ticketPrice} BDT`}
                    </span>

                    {activeTab === 'upcoming' && (
                      <button
                        onClick={() => {
                          setSelectedEvent(evt);
                          setRsvpSuccess(null);
                          setErrorMsg('');
                        }}
                        disabled={isFull}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-700 text-white'
                        }`}
                      >
                        {isFull ? 'Fully Booked' : 'Register / RSVP'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
          No events found in this section.
        </div>
      )}

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100 space-y-6">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!rsvpSuccess ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">Event RSVP</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedEvent.startTime).toLocaleString()} • {selectedEvent.location?.venue}
                  </p>
                </div>

                {!user && (
                  <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-xs font-semibold">
                    Please log in as a verified graduate to book tickets.
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Additional Guests</label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Preferences / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Gluten-Free, None"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-sm font-bold text-slate-800 border border-slate-100">
                    <span>Admission Fee</span>
                    <span className="text-brand-600">
                      {selectedEvent.ticketPrice === 0 ? 'Complimentary' : `${selectedEvent.ticketPrice} BDT`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!user || rsvpLoading}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50"
                  >
                    {rsvpLoading ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            ) : (
              /* Success & QR Code display */
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Registration Confirmed!</h3>
                <p className="text-xs text-slate-600">
                  Your ticket number is <strong className="text-slate-900">{rsvpSuccess.ticketNumber}</strong>. Present the QR code below at the reception entrance:
                </p>

                {rsvpSuccess.qrCodeString && (
                  <div className="p-4 bg-slate-50 rounded-2xl inline-block border border-slate-200">
                    <img src={rsvpSuccess.qrCodeString} alt="QR Code Ticket" className="w-48 h-48 mx-auto" />
                  </div>
                )}

                <div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full bg-brand-600 text-white font-bold py-2.5 rounded-xl text-sm"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
