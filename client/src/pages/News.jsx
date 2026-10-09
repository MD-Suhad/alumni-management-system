import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Calendar, Eye, Tag } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setArticles(res.data.data?.data || []);
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">News & Announcements</h1>
        <p className="text-slate-600 mt-1">Keep up to date with university milestones, alumni awards, and association activities.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading stories..." />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedArticle(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.bannerUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-brand-600">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{item.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  {item.viewsCount} views
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
          No stories available right now.
        </div>
      )}

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold"
            >
              ✕
            </button>

            <img
              src={selectedArticle.bannerUrl}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-2xl"
            />

            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{selectedArticle.category}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{selectedArticle.title}</h2>
              <p className="text-xs text-slate-400">Published on {new Date(selectedArticle.publishedAt).toLocaleDateString()}</p>
            </div>

            <div className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-4">
              <p className="font-semibold text-slate-800 text-base">{selectedArticle.summary}</p>
              <div className="mt-4 whitespace-pre-line">{selectedArticle.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
