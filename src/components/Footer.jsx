import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const quickLinks = [
    { name: 'Properties', path: '/' },
    { name: 'My Properties', path: '/my-properties' },
    { name: 'Add Property', path: '/add-property' },
  ];

  return (
    <footer className="mt-24 px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl px-8 py-10">
          {/* Top Section */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Home className="text-white" size={22} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
                  AuraEstates
                </span>
              </motion.div>

              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                Discover premium properties and manage your real estate investments with ease and
                transparency.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>

              <div className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}

                {!token && (
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>

              <div className="flex flex-col gap-3 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  support@auraestates.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Mumbai, India
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition-all"
                  >
                    <Icon size={18} className="text-gray-600" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AuraEstates. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
