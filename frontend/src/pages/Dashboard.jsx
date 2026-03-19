import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiDocumentText, HiChatAlt2,
  HiClipboardList, HiClock, HiCollection,
  HiArrowRight, HiLightningBolt, HiUser
} from 'react-icons/hi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Greeting */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 border border-white/10 shadow-2xl glass-panel group"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-violet-600/20 z-0"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/30 blur-[80px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-blue-300 font-semibold tracking-wide uppercase text-sm mb-2 flex items-center gap-2">
              <HiLightningBolt className="text-amber-400 text-lg" /> {getGreeting()}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Ready to crush it, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">{user?.name?.split(' ')[0] || 'Student'}</span>?
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              You have 3 tasks due today and a 45-minute focus session scheduled. Let's make it a productive day.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/tasks" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
              Start Tasks <HiArrowRight />
            </Link>
            <Link to="/pomodoro" className="px-6 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-center backdrop-blur-md">
              Focus Time
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans wide on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Action Cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: '/tasks', icon: HiClipboardList, label: 'Tasks', color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/50' },
              { to: '/pomodoro', icon: HiClock, label: 'Pomodoro', color: 'from-violet-500 to-fuchsia-500', shadow: 'shadow-violet-500/50' },
              { to: '/flashcards', icon: HiCollection, label: 'Flashcards', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/50' },
              { to: '/notes', icon: HiDocumentText, label: 'Notes', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/50' },
            ].map((action, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={action.to} className="block group">
                  <div className="glass-panel p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-0"></div>
                    <div className={`w-14 h-14 bg-gradient-to-tr ${action.color} rounded-2xl flex items-center justify-center shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <action.icon className="text-white text-2xl" />
                    </div>
                    <span className="font-semibold text-slate-300 group-hover:text-white transition-colors relative z-10">{action.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity/Tasks Section */}
          <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Priority Tasks</h2>
              <Link to="/tasks" className="text-sm font-medium text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Advanced Calculus Assignment', course: 'MATH 301', time: 'Due Today, 11:59 PM', priority: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                { title: 'Read Chapter 4: Neural Networks', course: 'CS 450', time: 'Due Tomorrow', priority: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                { title: 'Review Database Schema', course: 'CS 320', time: 'In 2 Days', priority: 'Low', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-blue-500 flex-shrink-0 transition-colors"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-blue-200 transition-colors">{task.title}</h3>
                    <p className="text-sm text-slate-400 truncate">{task.course} • {task.time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${task.color} hidden sm:block`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:flex lg:flex-col">
          
          {/* Pomodoro Stats Mini-Widget */}
          <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex-1">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600/20 blur-[50px] rounded-full"></div>
            
            <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center justify-between">
              Study Streaks <HiChatAlt2 className="text-slate-500" />
            </h2>
            
            <div className="flex items-end gap-4 mb-8 relative z-10">
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                12<span className="text-2xl text-slate-500">h</span>
              </h3>
              <p className="text-slate-400 pb-2 font-medium">focused this week</p>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Today</span>
                <span className="text-white font-bold">2.5 hrs</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full w-[70%] shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
              </div>
              
              <div className="flex justify-between items-center text-sm mt-4">
                <span className="text-slate-400">Daily Goal</span>
                <span className="text-slate-500 font-bold">4.0 hrs</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Forum Activity Mini-Widget */}
           <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Community</h2>
              <Link to="/forum" className="text-sm font-medium text-blue-400 hover:text-blue-300">Forum</Link>
            </div>

            <div className="space-y-4 flex-1">
              {[
                { title: 'Best resources for discrete math?', user: 'Alice', replies: 12 },
                { title: 'Anyone want to group study for finals?', user: 'Bob', replies: 5 },
              ].map((post, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-2 leading-snug">{post.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><HiUser /> {post.user}</span>
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;