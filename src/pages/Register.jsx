import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import Toast from '../components/Toast';

const Register = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    type: '',
    message: '',
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Check if form is filled
  const isFormValid = useMemo(() => {
    return form.name.trim() !== '' && form.email.trim() !== '' && form.password.trim() !== '';
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Manual validations
    if (!form.name.trim()) {
      return setToast({ type: 'warning', message: 'Name is required' });
    }

    if (!form.email.trim()) {
      return setToast({ type: 'warning', message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setToast({ type: 'warning', message: 'Invalid email format' });
    }

    if (!form.password.trim()) {
      return setToast({ type: 'warning', message: 'Password is required' });
    }

    if (form.password.length < 6) {
      return setToast({
        type: 'warning',
        message: 'Password must be at least 6 characters',
      });
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', form);

      if (res.data.success) {
        setToast({
          type: 'success',
          message: 'Account created successfully!',
        });

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md shadow-xl border border-white/20 rounded-2xl p-10 w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Home className="text-indigo-600" />
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center border rounded-xl px-3">
            <User size={18} className="text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 outline-none bg-transparent"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 outline-none bg-transparent"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 outline-none bg-transparent"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`p-3 rounded-xl font-semibold transition-all ${
              isFormValid
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </motion.div>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />
    </div>
  );
};

export default Register;
