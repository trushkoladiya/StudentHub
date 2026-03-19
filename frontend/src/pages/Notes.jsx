import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notesAPI } from '../services/api';
import NoteCard from '../components/notes/NoteCard';
import UploadNoteModal from '../components/notes/UploadNoteModal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiSearch, HiFilter, HiPlus, HiDocumentText, HiSparkles
} from 'react-icons/hi';

const SUBJECTS = [
  'All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
  'Data Structures', 'Algorithms', 'Operating Systems',
  'Database', 'Networks', 'Web Dev', 'Machine Learning', 'Other',
];

const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedSubject !== 'All') params.subject = selectedSubject;
      if (selectedSemester !== 'All') params.semester = selectedSemester;

      const { data } = await notesAPI.getAll(params);
      setNotes(data.data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, selectedSubject, selectedSemester]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUploadSuccess = (newNote) => setNotes((prev) => [newNote, ...prev]);
  const handleDelete = (deletedId) => setNotes((prev) => prev.filter((n) => n._id !== deletedId));
  const handleUpvote = (noteId, newCount) => {
    setNotes((prev) => prev.map((n) => n._id === noteId ? { ...n, upvotesCount: newCount } : n));
  };

  return (
    <div className="space-y-8 relative">
      {/* Background aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <HiDocumentText className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Study Resource Hub</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-xl">
            Access <span className="text-amber-400 font-bold">{notes.length}</span> high-quality community notes, past papers, and study guides.
          </p>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.5)' }}
          onClick={() => setShowUpload(true)}
          className="relative z-10 flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl border border-amber-400/30 transition-all whitespace-nowrap"
        >
          <HiPlus className="text-xl" />
          Share Resource
        </motion.button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative z-10">
        <div className="relative">
          <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search notes by title, subject, description..."
            className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner text-lg"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <HiFilter className="text-amber-500 text-lg" />
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Subject</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedSubject === s
                      ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Semester</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SEMESTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSemester(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedSemester === s
                      ? 'bg-white text-slate-900 shadow-lg border border-white'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {s === 'All' ? 'All' : `S${s}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10">
        {loading ? (
          <div className="glass-panel p-8 rounded-3xl border border-white/5"><SkeletonLoader count={6} /></div>
        ) : notes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel text-center py-24 rounded-3xl border border-white/5">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiDocumentText className="text-5xl text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No notes found</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Try adjusting your filters or be the first to share your knowledge with the community!</p>
            <button onClick={() => setShowUpload(true)} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Upload First Note
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={handleDelete} onUpvote={handleUpvote} />
            ))}
          </motion.div>
        )}
      </div>

      <UploadNoteModal isOpen={showUpload} onClose={() => setShowUpload(false)} onSuccess={handleUploadSuccess} />
    </div>
  );
};

export default Notes;