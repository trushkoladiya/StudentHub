import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiSparkles,
  HiBell,
  HiLogout,
  HiUser,
  HiMenuAlt3,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-30 
                 bg-slate-900/40 backdrop-blur-2xl border-b border-white/10
                 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
               whileHover={{ rotate: 180 }}
               transition={{ duration: 0.5 }}
               className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all">
              <HiSparkles className="text-white text-xl" />
            </motion.div>
            <span className="font-extrabold text-white text-xl tracking-tight">
              Student<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Hub</span>
            </span>
          </Link>

          {/* Right Side */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl 
                           bg-white/5 border border-white/10 hover:bg-white/10 
                           transition-colors relative"
              >
                <HiBell className="text-slate-300 text-lg" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 
                                 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
              </motion.button>

              {/* Profile Link */}
              <Link to="/profile" className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl 
                             bg-white/5 border border-white/10 hover:bg-white/10 
                             transition-all cursor-pointer shadow-inner"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 p-[2px]">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border border-slate-900"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <HiUser className="text-blue-400 text-sm" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                </motion.div>
              </Link>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl 
                           bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 
                           transition-colors hidden sm:flex"
                title="Logout"
              >
                <HiLogout className="text-red-400 text-lg" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <HiMenuAlt3 className="text-xl" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-blue-400 
                           hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white 
                             bg-gradient-to-r from-blue-600 to-violet-600
                             rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.4)]
                             hover:shadow-[0_6px_25px_rgba(59,130,246,0.6)] border border-blue-400/30"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;