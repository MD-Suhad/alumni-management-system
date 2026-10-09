import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & University Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-900 to-brand-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-gold-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-brand-950 tracking-tight leading-tight">
                  ALUMNI<span className="text-brand-600">PORTAL</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  University Association
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                Home
              </Link>
              <Link to="/directory" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                Directory
              </Link>
              <Link to="/events" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                Events
              </Link>
              <Link to="/jobs" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                Careers
              </Link>
              <Link to="/news" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                News
              </Link>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                About
              </Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section: Auth or User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    className="w-9 h-9 rounded-full object-cover border border-slate-300"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=1e3a8a&color=fff`}
                    alt={user.fullName}
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-slate-800 leading-none">{user.firstName}</p>
                    <span className="text-[11px] font-medium text-brand-600 uppercase">{user.role}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" />
                      Alumni Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 mr-3 text-slate-400" />
                      Profile & Privacy
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-brand-700 hover:bg-brand-50 font-semibold border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 mr-3 text-brand-600" />
                        Admin Portal
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Join Alumni
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            Alumni Directory
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            Events
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            Careers
          </Link>
          <Link
            to="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            News & Stories
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
          >
            About
          </Link>

          {user ? (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-bold text-brand-600 hover:bg-brand-50"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-bold text-slate-700 hover:bg-slate-50"
              >
                Profile Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md font-bold text-amber-600 hover:bg-amber-50"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md font-bold text-rose-600 hover:bg-rose-50"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-bold text-slate-700 py-2.5 rounded-lg border border-slate-300"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-bold text-white bg-brand-600 py-2.5 rounded-lg shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
