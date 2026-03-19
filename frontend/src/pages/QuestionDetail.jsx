import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiArrowLeft, HiCheckCircle, HiThumbUp,
  HiTag, HiUser, HiLightBulb,
} from 'react-icons/hi';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { data } = await questionsAPI.getAll();
        // Find the specific question from the list
        // In a real app you'd have a getById endpoint
        const found = data.data.find((q) => q._id === id);
        setQuestion(found || null);
      } catch {
        toast.error('Failed to load question');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return toast.error('Answer cannot be empty');

    setSubmitting(true);
    try {
      const { data } = await questionsAPI.postAnswer(id, {
        content: answerText,
      });
      setQuestion(data.data);
      setAnswerText('');
      toast.success('Answer posted!');
    } catch {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkBest = async (answerId) => {
    try {
      await questionsAPI.markBest(id, answerId);
      setQuestion((prev) => ({
        ...prev,
        isSolved: true,
        answers: prev.answers.map((a) => ({
          ...a,
          isBestAnswer: a._id === answerId,
        })),
      }));
      toast.success('Marked as best answer ✅');
    } catch {
      toast.error('Failed to mark best answer');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Question not found</p>
        <button onClick={() => navigate('/forum')}
          className="mt-4 text-primary font-semibold hover:underline">
          Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back button */}
      <button
        onClick={() => navigate('/forum')}
        className="flex items-center gap-2 text-sm text-gray-500 
                   hover:text-gray-900 transition-colors font-medium"
      >
        <HiArrowLeft /> Back to Forum
      </button>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6"
      >
        {question.isSolved && (
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm 
                          font-semibold mb-3">
            <HiCheckCircle className="text-lg" />
            Solved
          </div>
        )}

        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {question.title}
        </h1>

        {question.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {question.description}
          </p>
        )}

        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {question.tags.map((tag) => (
              <span key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 
                           text-primary text-xs font-semibold rounded-xl">
                <HiTag className="text-xs" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400 
                        pt-4 border-t border-gray-100">
          <HiUser />
          <span>{question.askedBy?.name}</span>
          <span>•</span>
          <span>{formatDate(question.createdAt)}</span>
        </div>
      </motion.div>

      {/* Answers Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {question.answers?.length || 0} Answers
        </h2>

        {question.answers?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border 
                          border-gray-100 shadow-soft">
            <HiLightBulb className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No answers yet. Be the first to help!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <motion.div
                key={answer._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-3xl border p-5 shadow-soft
                             ${answer.isBestAnswer
                               ? 'border-emerald-300 bg-emerald-50/30'
                               : 'border-gray-100'
                             }`}
              >
                {/* Best answer badge */}
                {answer.isBestAnswer && (
                  <div className="flex items-center gap-1.5 text-emerald-600 
                                  text-xs font-bold mb-3">
                    <HiCheckCircle className="text-base" />
                    Best Answer
                  </div>
                )}

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {answer.content}
                </p>

                <div className="flex items-center justify-between 
                                pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <HiUser />
                    <span>{answer.answeredBy?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{formatDate(answer.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 text-xs text-gray-400 
                                 hover:text-primary transition-colors"
                    >
                      <HiThumbUp />
                      {answer.upvotes?.length || 0}
                    </button>

                    {/* Mark best answer — only question owner can do this */}
                    {user?._id === question.askedBy?._id &&
                     !answer.isBestAnswer && (
                      <button
                        onClick={() => handleMarkBest(answer._id)}
                        className="flex items-center gap-1 px-2.5 py-1 
                                   bg-emerald-50 text-emerald-600 text-xs 
                                   font-semibold rounded-xl hover:bg-emerald-100 
                                   transition-colors"
                      >
                        <HiCheckCircle />
                        Mark Best
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Answer Box */}
      {user ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6"
        >
          <h3 className="font-bold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handlePostAnswer} className="space-y-4">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
              placeholder="Write a helpful, detailed answer..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 
                         rounded-2xl text-sm resize-none focus:outline-none 
                         focus:ring-2 focus:ring-violet-500 
                         focus:border-transparent transition-all duration-200"
            />
            <motion.button
              type="submit" disabled={submitting} whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-violet-600 text-white font-semibold 
                         text-sm rounded-2xl shadow-md shadow-violet-200 
                         hover:bg-violet-700 transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white 
                                   border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : 'Post Answer'}
            </motion.button>
          </form>
        </motion.div>
      ) : (
        <div className="text-center py-6 bg-white rounded-3xl border 
                        border-gray-100 shadow-soft">
          <p className="text-gray-500 text-sm">
            <a href="/login" className="text-primary font-semibold hover:underline">
              Login
            </a>{' '}
            to post an answer
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;