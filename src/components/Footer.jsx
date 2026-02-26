import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const quickLinks = [
    { name: 'Browse Properties', path: '/' },
    { name: 'Investment Dashboard', path: '/my-properties' },
    { name: 'List a Property', path: '/add-property' },
  ];

  const socialLinks = [
    { Icon: Facebook, color: 'hover:text-blue-600' },
    { Icon: Twitter, color: 'hover:text-sky-500' },
    { Icon: Instagram, color: 'hover:text-pink-600' },
    { Icon: Linkedin, color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="mt-32 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Glassmorphic Container */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] px-8 py-12 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand Section - 5 Columns */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer w-fit"
                onClick={() => navigate('/')}
              >
                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                  <Home className="text-white" size={24} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Aura<span className="text-indigo-600">Estates</span>
                </span>
              </motion.div>

              <p className="text-slate-500 text-base leading-relaxed max-w-sm">
                Redefining the art of real estate. We connect discerning clients with extraordinary
                spaces, ensuring every investment is a legacy in the making.
              </p>

              {/* Newsletter Small */}
              <div className="relative max-w-sm mt-2">
                <input
                  type="email"
                  placeholder="Get market insights..."
                  className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-3 px-5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button className="absolute right-1.5 top-1.5 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Quick Links - 3 Columns */}
            <div className="md:col-span-3">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Navigation</h3>
              <ul className="flex flex-col gap-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-500 hover:text-indigo-600 transition-colors font-medium flex items-center gap-2 group"
                    >
                      <span className="h-1 w-0 bg-indigo-600 rounded-full group-hover:w-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
                {!token && (
                  <li>
                    <Link
                      to="/login"
                      className="text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                      Member Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact - 4 Columns */}
            <div className="md:col-span-4">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Headquarters</h3>
              <div className="flex flex-col gap-5 text-slate-500">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm font-medium">
                    Platinum Heights, BKC Business District,
                    <br />
                    Mumbai, MH 400051
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm font-medium">+91 (22) 4500 8800</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium">concierge@auraestates.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-xs font-medium tracking-wide">
              © {new Date().getFullYear()} AURA ESTATES PVT LTD. DESIGNED FOR EXCELLENCE.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ Icon, color }, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, backgroundColor: 'white' }}
                  className={`bg-slate-100 p-3 rounded-xl text-slate-400 transition-all shadow-sm ${color}`}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
