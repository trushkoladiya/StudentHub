import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  HiX, HiUpload, HiDocumentText,
} from 'react-icons/hi';

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
  'Data Structures', 'Algorithms', 'Operating Systems',
  'Database Management', 'Computer Networks', 'Software Engineering',
  'Machine Learning', 'Web Development', 'Other',
];

const UploadNoteModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', description: '', subject: '', semester: '1',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (selectedFile) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      return toast.error('File must be under 10MB');
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(selectedFile.type)) {
      return toast.error('Only PDF and image files allowed');
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.semester) {
      return toast.error('Fill all required fields');
    }
    if (!file) return toast.error('Please select a file to upload');

    // Build FormData — required for file uploads
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('subject', form.subject);
    formData.append('semester', form.semester);
    formData.append('file', file); // 'file' matches multer field name

    setLoading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 10 : p));
      }, 200);

      const { data } = await notesAPI.upload(formData);

      clearInterval(progressInterval);
      setProgress(100);

      toast.success('Note uploaded successfully! 🎉');
      onSuccess(data.data); // Pass new note back to parent
      onClose();

      // Reset form
      setForm({ title: '', description: '', subject: '', semester: '1' });
      setFile(null);
      setProgress(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
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
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Upload Notes
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Share your notes with other students
                </p>
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
                  Title *
                </label>
                <input
                  type="text" name="title" value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Linked Lists — Complete Notes"
                  className={inputClass}
                />
              </div>

              {/* Subject + Semester row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    name="subject" value={form.subject}
                    onChange={handleChange} className={inputClass}
                  >
                    <option value="">Select subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Semester *
                  </label>
                  <select
                    name="semester" value={form.semester}
                    onChange={handleChange} className={inputClass}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description" value={form.description}
                  onChange={handleChange} rows={2}
                  placeholder="Brief description of what's covered..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* File Upload Drop Zone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  File * (PDF or Image, max 10MB)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center 
                               cursor-pointer transition-all duration-200
                               ${dragOver
                                 ? 'border-primary bg-blue-50'
                                 : file
                                 ? 'border-emerald-400 bg-emerald-50'
                                 : 'border-gray-200 hover:border-primary hover:bg-blue-50'
                               }`}
                >
                  <input
                    id="fileInput" type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <HiDocumentText className="text-emerald-500 text-2xl" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 
                                      truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <HiUpload className="text-3xl text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Drag & drop or{' '}
                        <span className="text-primary font-semibold">
                          browse files
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress Bar */}
              {loading && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Uploading to cloud...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-primary h-2 rounded-full transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-white font-semibold 
                           rounded-2xl shadow-md shadow-blue-200
                           hover:bg-blue-700 transition-all duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white 
                                     border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <HiUpload />
                    Upload Note
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

export default UploadNoteModal;