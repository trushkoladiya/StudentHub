import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiAcademicCap, HiCalendar, HiChartBar, HiClock } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 relative max-w-4xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-[40px] border border-white/5 overflow-hidden shadow-2xl relative"
      >
        <div className="h-48 bg-gradient-to-r from-blue-600 to-violet-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 blur-[40px] rounded-full"></div>
        </div>

        <div className="px-8 pb-12 relative">
          {/* Avatar */}
          <div className="flex justify-center -mt-20 mb-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-slate-900 border-[6px] border-slate-900 flex items-center justify-center p-1 relative z-10 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-inner overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-6xl font-extrabold">{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[20px] -z-10 animate-pulse"></div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">{user?.name}</h1>
            <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
              <HiMail className="text-lg" />
              {user?.email}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Details */}
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">University</p>
                <p className="text-white font-semibold text-lg">{user?.university || 'Student Hub Institute'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <HiAcademicCap className="text-blue-400 text-2xl" />
              </div>
            </div>

            {/* Semester Details */}
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Current Semester</p>
                <p className="text-white font-semibold text-lg">Semester {user?.semester || '1'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <HiCalendar className="text-violet-400 text-2xl" />
              </div>
            </div>

            {/* Study Stats Dummy */}
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Focus Time Logged</p>
                <p className="text-white font-semibold text-lg tracking-tight">42<span className="text-slate-400 text-sm font-medium ml-1">hours</span></p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                <HiClock className="text-fuchsia-400 text-2xl" />
              </div>
            </div>

            {/* Platform Rank Dummy */}
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Platform Rank</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-extrabold text-xl">Top 5%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <HiChartBar className="text-amber-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;