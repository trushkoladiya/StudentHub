import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { questionsAPI } from '../services/api';
import QuestionCard from '../components/forum/QuestionCard';
import AskQuestionModal from '../components/forum/AskQuestionModal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { HiSearch, HiPlus, HiChatAlt2, HiSparkles } from 'react-icons/hi';

const POPULAR_TAGS = [
  'algorithms', 'data-structures', 'os', 'dbms',
  'networks', 'maths', 'web-dev', 'machine-learning',
];

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (activeTag) params.tag = activeTag;
      const { data } = await questionsAPI.getAll(params);
      setQuestions(data.data);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [search, activeTag]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleNewQuestion = (q) => {
    setQuestions((prev) => [q, ...prev]);
  };

  return (
    <div className="space-y-8 relative">

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/5 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <HiChatAlt2 className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Community Forum</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-xl items-center gap-2">
            Join <span className="text-violet-400 font-bold">{questions.length}</span> active discussions and master new concepts together with peers.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.5)' }}
          onClick={() => setShowAsk(true)}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl border border-violet-400/30 transition-all whitespace-nowrap"
        >
          <HiPlus className="text-xl" />
          Ask a Question
        </motion.button>
      </div>

      {/* Search & Tags */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative z-10">
        <div className="relative">
          <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for answers to your doubts..."
            className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner text-lg"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag('')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTag === ''
                  ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-violet-500'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
              }`}
            >
              All Topics
            </button>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-violet-500'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="relative z-10">
        {loading ? (
          <div className="glass-panel p-6 rounded-3xl border border-white/5"><SkeletonLoader count={5} /></div>
        ) : questions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel text-center py-20 rounded-3xl border border-white/5">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiChatAlt2 className="text-5xl text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No questions found</h3>
            <p className="text-slate-400 text-lg mb-8">Start the discussion by asking a question.</p>
            <button
              onClick={() => setShowAsk(true)}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Ask First Question
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {questions.map((q) => (
              <QuestionCard key={q._id} question={q} />
            ))}
          </div>
        )}
      </div>

      <AskQuestionModal isOpen={showAsk} onClose={() => setShowAsk(false)} onSuccess={handleNewQuestion} />
    </div>
  );
};

export default Forum;