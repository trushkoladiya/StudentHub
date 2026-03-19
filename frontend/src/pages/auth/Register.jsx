import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiMail, HiLockClosed, HiArrowRight, HiUser, HiAcademicCap, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    semester: 1,
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.university) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full m-6 grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side - Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              <HiAcademicCap className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Join StudentHub</h2>
            <p className="text-slate-400 mb-8">Start organizing your academic life today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiUser className={`text-xl transition-colors ${focused === 'name' ? 'text-violet-400' : 'text-slate-500'}`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiMail className={`text-xl transition-colors ${focused === 'email' ? 'text-violet-400' : 'text-slate-500'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      placeholder="you@university.edu"
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiLockClosed className={`text-xl transition-colors ${focused === 'password' ? 'text-violet-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* University & Semester Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    onFocus={() => setFocused('university')}
                    onBlur={() => setFocused('')}
                    placeholder="Harvard University"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Semester</label>
                  <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    onFocus={() => setFocused('semester')}
                    onBlur={() => setFocused('')}
                    min="1"
                    max="10"
                    placeholder="1"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-violet-500/30"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    Sign Up <HiArrowRight />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Visuals */}
        <div className="hidden lg:flex flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-bl from-violet-600/10 to-fuchsia-600/10 border-l border-white/5 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <HiSparkles className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Potential</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Join thousands of students organizing their study materials, engaging in discussions, and hitting their academic goals.
            </p>
          </motion.div>

          {/* Abstract aesthetic shapes */}
          <div className="absolute top-1/4 left-10 w-32 h-32 border border-white/10 rounded-full rotate-45 opacity-50"></div>
          <div className="absolute bottom-1/4 right-10 w-24 h-24 border border-violet-500/30 rounded-lg rotate-12 opacity-50"></div>
        </div>

      </div>
    </div>
  );
};

export default Register;