import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import Toast from '../components/Toast';
import usePropertyStore from '../store/propertyStore';

const Login = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    type: '',
    message: '',
  });
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchProperties, fetchMyProperties } = usePropertyStore();

  const isFormValid = useMemo(() => {
    return form.email.trim() !== '' && form.password.trim() !== '';
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      return setToast({ type: 'warning', message: 'Email is required' });
    }

    if (!form.password.trim()) {
      return setToast({ type: 'warning', message: 'Password is required' });
    }
    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      console.log(res);
      if (res.data.success) {
        localStorage.setItem('token', res?.data?.data?.token);

        setToast({
          type: 'success',
          message: 'Login successful!',
        });
        fetchProperties(true);
        fetchMyProperties(true);
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Invalid credentials',
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
          <h2 className="text-2xl font-bold">Welcome Back</h2>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center border rounded-xl px-3">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border rounded-xl px-3">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 outline-none bg-transparent"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="bg-gray-900 text-white p-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '' })} />
    </div>
  );
};

export default Login;
