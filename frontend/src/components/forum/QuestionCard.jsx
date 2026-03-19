import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiChatAlt2, HiEye, HiTag,
  HiUser, HiCheckCircle, HiClock
} from 'react-icons/hi';

const QuestionCard = ({ question }) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-3xl border border-white/5 p-6 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-[0_15px_30px_-5px_rgba(139,92,246,0.2)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
      
      <Link to={`/forum/${question._id}`} className="relative z-10 block">
        {/* Solved badge */}
        {question.isSolved && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-3 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/30">
            <HiCheckCircle className="text-sm" />
            Solved
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-white text-xl leading-tight mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
          {question.title}
        </h3>

        {/* Description preview */}
        {question.description && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {question.description}
          </p>
        )}

        {/* Tags */}
        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {question.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-bold rounded-lg"
              >
                <HiTag className="text-xs" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10 font-medium text-slate-400">
        
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <HiUser className="text-violet-400 text-xs" />
              </div>
            </div>
            <span className="text-slate-300 font-semibold">{question.askedBy?.name || 'Anonymous'}</span>
          </div>
          <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5">
            <HiClock className="text-slate-500" />
            {formatDate(question.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 transition-colors px-4 py-2 rounded-xl text-white">
            <HiChatAlt2 className="text-violet-400 text-lg" />
            {question.answers?.length || 0} answers
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 transition-colors px-4 py-2 rounded-xl text-white">
            <HiEye className="text-fuchsia-400 text-lg" />
            {question.views || 0} views
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;