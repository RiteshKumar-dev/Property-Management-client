import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Menu,
  X,
  Building2,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Handle scroll effect for the glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', icon: <Building2 size={18} />, path: '/' },
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/my-properties' },
    { name: 'Favorites', icon: <Heart size={18} />, path: '/interest-properties' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`
          relative transition-all duration-300 border px-6 py-3 flex items-center justify-between
          ${
            scrolled
              ? 'bg-white/80 backdrop-blur-lg border-white/40 shadow-xl rounded-2xl'
              : 'bg-white/40 backdrop-blur-md border-white/20 shadow-sm rounded-3xl'
          }
        `}
        >
          {/* Brand Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300" />
              <div className="relative bg-indigo-600 p-2 rounded-lg shadow-inner">
                <Home className="text-white" size={22} />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Aura<span className="text-indigo-600">Estates</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                Luxury Living
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {token && (
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path} className="relative px-4 py-2 group">
                    <div
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 z-10 relative
                      ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {link.icon}
                      {link.name}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white shadow-sm rounded-lg border border-slate-200"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {token ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-slate-200"
              >
                <LogOut size={16} />
                Sign Out
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Sparkles size={16} />
                Client Access
              </motion.button>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="md:hidden mt-3 bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-200 flex flex-col gap-2"
            >
              {token &&
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="p-2 bg-white rounded-lg shadow-sm">{link.icon}</span>
                    <span className="font-bold text-base">{link.name}</span>
                  </Link>
                ))}

              <div className="h-px bg-slate-100 my-2" />

              <button
                onClick={token ? handleLogout : () => navigate('/login')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white shadow-lg ${token ? 'bg-slate-900' : 'bg-indigo-600'}`}
              >
                {token ? <LogOut size={18} /> : <LogIn size={18} />}
                {token ? 'Log Out' : 'Login to Aura'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
