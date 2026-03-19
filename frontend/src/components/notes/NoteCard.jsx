import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { notesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  HiDocumentText, HiPhotograph, HiThumbUp,
  HiDownload, HiTrash, HiUser, HiCalendar,
} from 'react-icons/hi';

const NoteCard = ({ note, onDelete, onUpvote }) => {
  const { user } = useAuth();
  const [upvoting, setUpvoting] = useState(false);

  const hasUpvoted = note.upvotes?.includes(user?._id);

  const handleUpvote = async () => {
    if (!user) return toast.error('Login to upvote');
    setUpvoting(true);
    try {
      const { data } = await notesAPI.upvote(note._id);
      onUpvote(note._id, data.upvotes);
    } catch {
      toast.error('Failed to upvote');
    } finally {
      setUpvoting(false);
    }
  };

  const handleDownload = () => {
    window.open(note.fileURL, '_blank');
    toast.success('Opening file...');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesAPI.delete(note._id);
      toast.success('Note deleted');
      onDelete(note._id);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const isPDF = note.fileType === 'pdf';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.2)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
      
      {/* Top: Icon + Title */}
      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner
                         ${isPDF 
                           ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30' 
                           : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30'}`}>
          {isPDF ? <HiDocumentText className="text-3xl drop-shadow-md" /> : <HiPhotograph className="text-3xl drop-shadow-md" />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-2 group-hover:text-amber-300 transition-colors">
            {note.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              {note.subject}
            </span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">
              Sem {note.semester}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {note.description && (
        <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2 relative z-10">
          {note.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-5 relative z-10 font-medium">
        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-lg">
          <HiUser className="text-slate-400" />
          <span className="truncate max-w-[100px]">{note.uploadedBy?.name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-lg">
          <HiCalendar className="text-slate-400" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleUpvote}
          disabled={upvoting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                      ${hasUpvoted
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                      }`}
        >
          <HiThumbUp className={`text-lg ${upvoting ? 'animate-bounce' : ''}`} />
          {note.upvotes?.length || 0}
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 text-sm font-bold transition-colors border border-emerald-500/30"
          >
            <HiDownload className="text-lg" />
            <span className="hidden sm:inline">Get</span>
          </motion.button>

          {(user?._id === note.uploadedBy?._id || user?.role === 'admin') && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors border border-red-500/30"
            >
              <HiTrash className="text-lg" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;