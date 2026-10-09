import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import {
  Users,
  Calendar,
  Briefcase,
  Award,
  ArrowRight,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, newsRes] = await Promise.all([
          api.get('/events?limit=3'),
          api.get('/news?limit=3')
        ]);
        setEvents(eventsRes.data.data?.data || []);
        setNews(newsRes.data.data?.data || []);
      } catch (err) {
        // Fallback gracefully if API not yet populated
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Official University Alumni Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Connecting Generations. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-brand-300 to-gold-400">
                  Inspiring the Future.
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Welcome home! Reconnect with your batchmates, discover high-impact career opportunities, participate in grand reunions, and contribute to the enduring legacy of our institution.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/40 hover:-translate-y-0.5 transition-all text-base"
                >
                  Join the Association
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/directory"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-all text-base"
                >
                  Explore Directory
                </Link>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 to-gold-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                    alt="Alumni Gathering"
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">Annual Reunion</span>
                      <h3 className="text-white text-lg font-bold">Celebrating 50 Years of Academic Excellence</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Key Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1 border-r border-slate-100 last:border-none">
            <p className="text-3xl lg:text-4xl font-extrabold text-brand-900">25,000+</p>
            <p className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Alumni Worldwide</p>
          </div>
          <div className="space-y-1 border-r border-slate-100 last:border-none">
            <p className="text-3xl lg:text-4xl font-extrabold text-brand-900">45+</p>
            <p className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Batches Graduated</p>
          </div>
          <div className="space-y-1 border-r border-slate-100 last:border-none">
            <p className="text-3xl lg:text-4xl font-extrabold text-brand-900">18+</p>
            <p className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Academic Disciplines</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl lg:text-4xl font-extrabold text-gold-600">5M+ BDT</p>
            <p className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Scholarship Fund</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-1">Mark Your Calendar</div>
            <h2 className="text-3xl font-extrabold text-slate-900">Upcoming Alumni Events</h2>
          </div>
          <Link to="/events" className="inline-flex items-center text-brand-600 font-bold hover:text-brand-700 text-sm mt-3 md:mt-0">
            View All Events <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div key={evt._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition-all group flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={evt.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow text-xs font-bold text-brand-800">
                    {evt.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center text-xs font-semibold text-slate-500 space-x-3 mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-brand-600" />
                        {new Date(evt.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {evt.location?.city || 'Campus'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{evt.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      {evt.ticketPrice === 0 ? 'Free' : `${evt.ticketPrice} BDT`}
                    </span>
                    <Link
                      to="/events"
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      Details & RSVP
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No upcoming events scheduled right now. Check back soon!
          </div>
        )}
      </section>

      {/* Latest News & Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-1">Campus & Community</div>
            <h2 className="text-3xl font-extrabold text-slate-900">Latest News & Stories</h2>
          </div>
          <Link to="/news" className="inline-flex items-center text-brand-600 font-bold hover:text-brand-700 text-sm mt-3 md:mt-0">
            Read More Stories <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition-all flex flex-col">
                <div className="h-44 overflow-hidden">
                  <img
                    src={item.bannerUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{item.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">{item.summary}</p>
                  </div>
                  <div className="text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
                    Published {new Date(item.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
            No articles posted yet.
          </div>
        )}
      </section>

      {/* Institutional Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Reconnect with Your Alma Mater?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Join thousands of university graduates building networks, mentoring current students, and celebrating shared achievements across the globe.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-base"
              >
                Register Your Account
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 transition-all text-base"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
