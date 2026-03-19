import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flashcardsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiCollection, HiArrowRight, HiArrowLeft, HiRefresh, HiTrash } from 'react-icons/hi';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newDeckName, setNewDeckName] = useState('');
  const [newCards, setNewCards] = useState([{ front: '', back: '' }]);

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await flashcardsAPI.getAll();
      setDecks(data.data);
    } catch {
      toast.error('Failed to load flashcard decks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim() || newCards.some(c => !c.front.trim() || !c.back.trim())) {
      return toast.error('Please fill all fields');
    }

    try {
      const { data } = await flashcardsAPI.create({
        deckName: newDeckName,
        cards: newCards
      });
      setDecks([data.data, ...decks]);
      setShowCreateModal(false);
      setNewDeckName('');
      setNewCards([{ front: '', back: '' }]);
      toast.success('Deck created successfully!');
    } catch {
      toast.error('Failed to create deck');
    }
  };

  const handleDeleteDeck = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this deck?')) return;
    try {
      await flashcardsAPI.delete(id);
      setDecks(decks.filter(d => d._id !== id));
      if (activeDeck?._id === id) {
        setActiveDeck(null);
      }
      toast.success('Deck deleted');
    } catch {
      toast.error('Failed to delete deck');
    }
  };

  const startReview = (deck) => {
    if (!deck.cards || deck.cards.length === 0) {
      return toast.error('This deck has no cards');
    }
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
    }, 150);
  };

  // Add/Remove card inputs in creation form
  const addCardInput = () => setNewCards([...newCards, { front: '', back: '' }]);
  const updateCardInput = (index, field, value) => {
    const updated = [...newCards];
    updated[index][field] = value;
    setNewCards(updated);
  };
  const removeCardInput = (index) => {
    if (newCards.length > 1) {
      setNewCards(newCards.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8 relative max-w-6xl mx-auto min-h-[80vh]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      {!activeDeck && (
        <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/10 z-0"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <HiCollection className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Flashcards</h1>
              <p className="text-emerald-100 font-medium">Master concepts with active recall</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative z-10 flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all"
          >
            <HiPlus className="text-xl" /> Create New Deck
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader count={3} />
        </div>
      ) : activeDeck ? (
        // ─── Study / Review Mode ───────────────────────────────────
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center pt-10"
        >
          <div className="w-full flex justify-between items-center mb-10 max-w-2xl">
            <div>
              <h2 className="text-2xl font-bold text-white">{activeDeck.deckName}</h2>
              <p className="text-slate-400 font-medium tracking-wide">Card {currentCardIndex + 1} of {activeDeck.cards.length}</p>
            </div>
            <button
              onClick={() => setActiveDeck(null)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
            >
              Exit Study
            </button>
          </div>

          {/* 3D Flashcard Container */}
          <div className="perspective-1000 w-full max-w-2xl aspect-[3/2] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="w-full h-full relative preserve-3d transition-all duration-500 ease-in-out"
              animate={{ rotateX: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden glass-panel border border-white/10 rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-slate-900 to-slate-800">
                <span className="absolute top-6 left-8 text-emerald-500 font-black uppercase tracking-widest text-sm opacity-50">Front</span>
                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  {activeDeck.cards[currentCardIndex].front}
                </h3>
                <p className="absolute bottom-6 text-slate-500 font-medium text-sm animate-pulse">Click anywhere to flip</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden glass-panel border border-emerald-500/30 rounded-[40px] shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-slate-900 to-slate-800 [transform:rotateX(180deg)]">
                <span className="absolute top-6 left-8 text-teal-400 font-black uppercase tracking-widest text-sm opacity-50">Back</span>
                <p className="text-2xl md:text-4xl font-bold text-emerald-50 leading-tight">
                  {activeDeck.cards[currentCardIndex].back}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-12">
            <button onClick={prevCard} className="w-14 h-14 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-95 shadow-lg">
              <HiArrowLeft className="text-2xl" />
            </button>
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all active:scale-95">
              <HiRefresh className={`inline mr-2 text-xl ${isFlipped ? 'rotate-180' : ''} transition-transform duration-500`} /> 
              {isFlipped ? "Show Front" : "Show Answer"}
            </button>
            <button onClick={nextCard} className="w-14 h-14 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-95 shadow-lg">
              <HiArrowRight className="text-2xl" />
            </button>
          </div>

        </motion.div>

      ) : (
        // ─── Decks Grid ─────────────────────────────────────────
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.length === 0 ? (
            <div className="col-span-full glass-panel py-20 rounded-3xl border border-white/5 text-center flex flex-col items-center">
              <HiCollection className="text-6xl text-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Decks Found</h2>
              <p className="text-slate-400 mb-6">Create your first flashcard deck to start studying!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors shadow-lg"
              >
                Create Deck
              </button>
            </div>
          ) : (
            decks.map((deck) => (
              <motion.div
                key={deck._id}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group relative flex flex-col min-h-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/5 group-hover:opacity-100 opacity-0 transition-opacity rounded-3xl"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-auto">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/5 text-emerald-400 text-2xl group-hover:scale-110 transition-transform shadow-inner">
                    <HiCollection />
                  </div>
                  <button
                    onClick={(e) => handleDeleteDeck(deck._id, e)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <HiTrash />
                  </button>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors line-clamp-1">{deck.deckName}</h3>
                  <p className="text-slate-400 font-medium text-sm mb-6">{deck.cards?.length || 0} Cards</p>
                  
                  <button
                    onClick={() => startReview(deck)}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-white font-bold border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    Study Now <HiArrowRight />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ─── Create Deck Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HiPlus className="text-emerald-500" /> Create New Deck
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Deck Name</label>
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g. Biology 101 Finals"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Flashcards</label>
                  </div>
                  
                  {newCards.map((card, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 relative group">
                      <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-xs font-bold border border-slate-600">{index + 1}</div>
                      
                      <input
                        type="text"
                        value={card.front}
                        onChange={(e) => updateCardInput(index, 'front', e.target.value)}
                        placeholder="Term (Front)"
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition-colors"
                      />
                      <input
                        type="text"
                        value={card.back}
                        onChange={(e) => updateCardInput(index, 'back', e.target.value)}
                        placeholder="Definition (Back)"
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition-colors"
                      />
                      
                      {newCards.length > 1 && (
                        <button
                          onClick={() => removeCardInput(index)}
                          className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                          <HiTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={addCardInput}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 text-slate-400 font-bold hover:border-emerald-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <HiPlus /> Add Another Card
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeck}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors"
                >
                  Save Deck
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  );
};

export default Flashcards;
