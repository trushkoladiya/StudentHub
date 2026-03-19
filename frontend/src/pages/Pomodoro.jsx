import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { studyAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiPlay, HiPause, HiRefresh, HiClock, HiCollection } from 'react-icons/hi';

const MODES = {
  pomodoro: { name: 'Pomodoro', duration: 25 * 60, color: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/40', text: 'text-orange-500' },
  shortBreak: { name: 'Short Break', duration: 5 * 60, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-teal-500/40', text: 'text-teal-400' },
  longBreak: { name: 'Long Break', duration: 15 * 60, color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/40', text: 'text-blue-400' },
};

const Pomodoro = () => {
  const [activeMode, setActiveMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState('');
  const timerRef = useRef(null);
  
  // Previous sessions
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await studyAPI.getAll();
      setSessions(data.data);
    } catch {
      toast.error('Failed to load study sessions');
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    
    // Play sound (using HTML5 Audio)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {}); // Catch error if browser blocks autoplay

    toast.success(`${MODES[activeMode].name} completed!`, {
      icon: '🎉',
    });

    if (activeMode === 'pomodoro') {
      try {
        await studyAPI.logSession({ 
          topic: topic || 'General Study', 
          duration: 25 
        });
        fetchSessions();
      } catch {
        toast.error('Failed to log session to dashboard');
      }
    }
  };

  const switchMode = (modeKey) => {
    setIsRunning(false);
    setActiveMode(modeKey);
    setTimeLeft(MODES[modeKey].duration);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[activeMode].duration);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentMode = MODES[activeMode];
  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;

  return (
    <div className="space-y-8 relative max-w-5xl mx-auto">
      {/* Dynamic Background Glow based on active mode */}
      <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none -z-10 bg-gradient-to-r ${currentMode.color} opacity-20 transition-colors duration-1000`}></div>
      
      {/* Header Container */}
      <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentMode.color} opacity-5 z-0 transition-colors duration-1000`}></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 bg-gradient-to-tr ${currentMode.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${currentMode.shadow} transition-all duration-500`}>
            <HiClock className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Focus Flow</h1>
          <p className="text-slate-400 font-medium max-w-lg">Master your time with the Pomodoro technique. Work in focused bursts, then take well-deserved breaks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Timer Display */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] border border-white/5 shadow-2xl relative flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Mode Selector */}
          <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-700/50 mb-10 w-full max-w-md relative z-10">
            {Object.keys(MODES).map((key) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all relative z-10 ${
                  activeMode === key ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeMode === key && (
                  <motion.div
                    layoutId="active-mode"
                    className={`absolute inset-0 bg-gradient-to-r ${MODES[key].color} rounded-xl -z-10`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {MODES[key].name}
              </button>
            ))}
          </div>

          {/* Radial Timer */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-12">
            
            {/* Pulsing ring background when running */}
            {isRunning && (
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentMode.color} opacity-20 blur-xl animate-pulse`}></div>
            )}
            
            <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-2xl">
              <circle cx="50%" cy="50%" r="46%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle cx="50%" cy="50%" r="46%" stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray="289%"
                strokeDashoffset={`${289 - (289 * progress) / 100}%`}
                className={`${currentMode.text} transition-all duration-1000 ease-linear rounded-full`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center z-20">
              <span className="text-7xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-lg tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className={`text-sm font-bold uppercase tracking-[0.2em] mt-2 ${currentMode.text}`}>
                {isRunning ? 'Focusing...' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 relative z-10">
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 bg-gradient-to-tr ${currentMode.color} ${currentMode.shadow}`}
            >
              {isRunning ? <HiPause className="text-white text-4xl" /> : <HiPlay className="text-white text-4xl ml-2" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <HiRefresh className="text-2xl" />
            </button>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Topic Input */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 relative">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <HiCollection className="text-amber-400" /> Current Session Topic
            </h3>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Advanced Calculus Ch 4"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm font-medium"
            />
          </div>

          {/* Past Sessions Widget */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex-1 relative min-h-[300px]">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <HiClock className="text-fuchsia-400" /> Today's Focus Log
            </h3>
            
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No sessions completed today.</p>
              ) : (
                sessions.slice(0, 5).map((session) => (
                  <div key={session._id} className="bg-slate-900/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="truncate flex-1 pr-2">
                      <p className="text-white font-medium text-sm truncate">{session.topic}</p>
                      <p className="text-slate-500 text-xs">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border border-orange-500/20">
                      {session.duration} min
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Pomodoro;
