import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiUser, HiMail, HiLockClosed,
  HiAcademicCap, HiLibrary,
} from 'react-icons/hi';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    university: '', semester: '1',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill all required fields');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to StudentHub 🎓');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 
    rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary 
    focus:border-transparent transition-all duration-200`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white 
                    to-indigo-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-primary rounded-3xl flex items-center 
                       justify-center mx-auto mb-4 shadow-lg shadow-blue-200"
          >
            <HiAcademicCap className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Join thousands of students on StudentHub
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400 text-lg" />
                <input type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Rahul Sharma"
                  className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 
                                   text-gray-400 text-lg" />
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@university.edu"
                  className={inputClass} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 
                                          text-gray-400 text-lg" />
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters"
                  className={inputClass} />
              </div>
            </div>

            {/* University */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                University
              </label>
              <div className="relative">
                <HiLibrary className="absolute left-4 top-1/2 -translate-y-1/2 
                                       text-gray-400 text-lg" />
                <input type="text" name="university" value={form.university}
                  onChange={handleChange} placeholder="MIT, Pune University..."
                  className={inputClass} />
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Semester
              </label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 
                           rounded-2xl text-sm focus:outline-none focus:ring-2 
                           focus:ring-primary focus:border-transparent 
                           transition-all duration-200"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-primary text-white font-semibold 
                         rounded-2xl shadow-md shadow-blue-200 mt-2
                         hover:bg-blue-700 transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white 
                                   border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;