import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiMail, HiLockClosed, HiArrowRight, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full m-6 grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side - Fancy Visuals */}
        <div className="hidden lg:flex flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-violet-600/10 border-r border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <HiSparkles className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Welcome back to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">StudentHub PRO</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              The ultimate platform to track your tasks, ace your exams with flashcards, and master the Pomodoro technique. Let's get to work.
            </p>
          </motion.div>

          {/* Abstract aesthetic shapes */}
          <div className="absolute top-1/4 right-10 w-32 h-32 border border-white/10 rounded-full rotate-45 opacity-50"></div>
          <div className="absolute bottom-1/4 left-10 w-24 h-24 border border-blue-500/30 rounded-lg rotate-12 opacity-50"></div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 sm:p-16 flex flex-col justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:hidden w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <HiSparkles className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 mb-10">Access your personalized learning dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiMail className={`text-xl transition-colors ${focused === 'email' ? 'text-blue-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="you@university.edu"
                    className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiLockClosed className={`text-xl transition-colors ${focused === 'password' ? 'text-blue-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500/50" />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-blue-500/30"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign In <HiArrowRight />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;