import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiCheckCircle, HiClock, HiClipboardList } from 'react-icons/hi';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tasksAPI.getAll();
      setTasks(data.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data } = await tasksAPI.create({ title: newTask, priority });
      setTasks([data.data, ...tasks]);
      setNewTask('');
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic update
      setTasks(tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
      await tasksAPI.update(task._id, { status: newStatus });
    } catch {
      toast.error('Failed to update task');
      fetchTasks(); // Revert
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setTasks(tasks.filter((t) => t._id !== id));
      await tasksAPI.delete(id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
      fetchTasks();
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="space-y-8 relative max-w-5xl mx-auto">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/10 z-0"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <HiClipboardList className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Task Tracker</h1>
            <p className="text-slate-400 font-medium">Manage your assignments and to-dos</p>
          </div>
        </div>
        
        {/* Progress Circle Component */}
        <div className="relative z-10 flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                strokeDasharray="175"
                strokeDashoffset={175 - (175 * progress) / 100}
                className="text-blue-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white">{progress}%</span>
          </div>
          <div>
            <p className="text-white font-bold">{completedTasks.length} / {tasks.length}</p>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Add Task & Pending */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleAddTask} className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg relative z-10 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner text-lg"
            />
            <div className="flex gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Med Priority</option>
                <option value="high">High Priority</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!newTask.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50 flex-shrink-0"
              >
                <HiPlus className="text-2xl" />
              </motion.button>
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <HiClock className="text-blue-400" /> Pending Tasks
            </h2>
            {loading ? <SkeletonLoader count={3} /> : pendingTasks.length === 0 ? (
              <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center text-slate-400">No pending tasks. You're all caught up!</div>
            ) : (
              <AnimatePresence>
                {pendingTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => toggleTaskStatus(task)} className="w-6 h-6 rounded-full border-2 border-slate-600 hover:border-blue-400 hover:bg-blue-400/20 transition-all"></button>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>{task.priority}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTask(task._id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <HiTrash className="text-xl" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Col: Completed Tasks */}
        <div>
          <h2 className="text-xl font-bold text-slate-400 mb-4 flex items-center gap-2">
            <HiCheckCircle className="text-emerald-500" /> Completed
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity group"
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTaskStatus(task)} className="text-emerald-500 bg-emerald-500/10 rounded-full w-6 h-6 flex items-center justify-center">
                      <HiCheckCircle className="text-xl" />
                    </button>
                    <h3 className="text-slate-400 font-medium line-through">{task.title}</h3>
                  </div>
                  <button onClick={() => handleDeleteTask(task._id)} className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <HiTrash />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskTracker;
