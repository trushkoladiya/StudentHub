import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questionsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiX, HiLightBulb, HiPlus } from 'react-icons/hi';

const AskQuestionModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', description: '', tagInput: '', tags: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a tag when user presses Enter or comma
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && form.tagInput.trim()) {
      e.preventDefault();
      const newTag = form.tagInput.trim().toLowerCase();
      if (!form.tags.includes(newTag) && form.tags.length < 5) {
        setForm({ ...form, tags: [...form.tags, newTag], tagInput: '' });
      } else {
        setForm({ ...form, tagInput: '' });
      }
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Question title is required');

    setLoading(true);
    try {
      const { data } = await questionsAPI.create({
        title: form.title,
        description: form.description,
        tags: form.tags,
      });
      toast.success('Question posted! 🎉');
      onSuccess(data.data);
      onClose();
      setForm({ title: '', description: '', tagInput: '', tags: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 bg-gray-50 border border-gray-200 
    rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary 
    focus:border-transparent transition-all duration-200`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 
                       p-6 mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 flex 
                                items-center justify-center">
                  <HiLightBulb className="text-violet-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Ask a Question
                  </h2>
                  <p className="text-xs text-gray-500">
                    Get help from fellow students
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full 
                           bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <HiX className="text-gray-600 text-sm" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Question Title *
                </label>
                <input
                  type="text" name="title" value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. How does dynamic programming work?"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Details (optional)
                </label>
                <textarea
                  name="description" value={form.description}
                  onChange={handleChange} rows={4}
                  placeholder="Explain your problem in detail, share what you've tried..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tags (press Enter to add, max 5)
                </label>

                {/* Tag chips */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 
                                   bg-primary/10 text-primary text-xs 
                                   font-semibold rounded-xl"
                      >
                        {tag}
                        <button
                          type="button" onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <HiX className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <input
                  type="text" name="tagInput" value={form.tagInput}
                  onChange={handleChange} onKeyDown={handleTagKeyDown}
                  placeholder="e.g. algorithms, recursion, arrays..."
                  className={inputClass}
                  disabled={form.tags.length >= 5}
                />
              </div>

              <motion.button
                type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-violet-600 text-white font-semibold 
                           rounded-2xl shadow-md shadow-violet-200
                           hover:bg-violet-700 transition-all duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white 
                                     border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <HiPlus className="text-lg" />
                    Post Question
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AskQuestionModal;