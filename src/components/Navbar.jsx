import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Menu, X, Building2, Heart, LayoutDashboard, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const navLinks = [
    {
      name: 'Properties',
      icon: <Building2 size={18} />,
      path: '/',
    },
    {
      name: 'My Properties',
      icon: <LayoutDashboard size={18} />,
      path: '/my-properties',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Home className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AuraEstates
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          {token && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ y: -2 }}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {token ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-500 transition-all shadow-md"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-md"
              >
                <LogIn size={18} />
                Login
              </motion.button>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col gap-4"
            >
              {token &&
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center gap-3 p-3 text-gray-600 hover:bg-indigo-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}

              <hr className="border-gray-100" />

              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded-xl font-bold"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-xl font-bold"
                >
                  <LogIn size={18} />
                  Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
