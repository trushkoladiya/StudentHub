import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome,
  HiDocumentText,
  HiChatAlt2,
  HiCalendar,
  HiBookOpen,
  HiClipboardList,
  HiClock,
  HiCollection,
  HiUser,
  HiShieldCheck,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', to: '/', icon: HiHome },
  { label: 'Tasks', to: '/tasks', icon: HiClipboardList },
  { label: 'Pomodoro', to: '/pomodoro', icon: HiClock },
  { label: 'Flashcards', to: '/flashcards', icon: HiCollection },
  { label: 'Notes', to: '/notes', icon: HiDocumentText },
  { label: 'Forum', to: '/forum', icon: HiChatAlt2 },
  { label: 'Profile', to: '/profile', icon: HiUser },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-16 bottom-0 w-64 glass-panel border-r 
                 border-white/10 z-20 hidden lg:flex flex-col 
                 overflow-y-auto"
    >
      <div className="p-5 flex-1 space-y-6">

        {/* User Card */}
        {user && (
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <span className="text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  Sem {user.semester} • {user.university || 'Student'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3 mb-4">
            Study Modules
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm 
                 font-medium transition-all duration-300 relative group
                 ${isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-300'
                    }`}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-white/10">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm 
                   font-medium transition-all duration-300
                   ${isActive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-slate-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HiShieldCheck className={`text-xl ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
                    Admin Portal
                  </>
                )}
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      <div className="p-5 border-t border-white/10">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1 font-medium">
          StudentHub <span className="text-blue-500">PRO</span> &copy; 2026
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;