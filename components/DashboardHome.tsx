
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, Cloud, Timer, FileText, Bell, CheckSquare, 
  Zap, Battery, MapPin, Plus, Trash2, ChevronRight, Play, Pause, RotateCcw, Star
} from 'lucide-react';
import { CalculatorLogo } from './CalculatorLogo';
import { CalculatorDef, HistoryItem } from '../types';
import { CALCULATORS } from '../services/calculatorEngine';

interface DashboardHomeProps {
  onSelectCalculator: (calc: CalculatorDef) => void;
  favorites?: string[];
  history?: HistoryItem[];
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  onSelectCalculator,
  favorites = [],
  history = []
}) => {
  const [time, setTime] = useState(new Date());
  const [notepad, setNotepad] = useState(localStorage.getItem('omni-note') || '');
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>(
    JSON.parse(localStorage.getItem('omni-todos') || '[]')
  );
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => { localStorage.setItem('omni-note', notepad); }, [notepad]);
  useEffect(() => { localStorage.setItem('omni-todos', JSON.stringify(todos)); }, [todos]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const favoriteTools = useMemo(() => CALCULATORS.filter(c => favorites.includes(c.id)), [favorites]);
  const recentCalculators = useMemo(() => {
    return history
      .map(h => CALCULATORS.find(c => c.id === h.calculatorId))
      .filter((c, i, self) => c && self.findIndex(t => t?.id === c.id) === i)
      .slice(0, 4);
  }, [history]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-fade-in pb-40">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <CalculatorLogo className="w-64 h-80" />
        </div>
        <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
            YOUR <span className="text-indigo-500">ULTIMATE</span><br />
            COMPUTE HUB.
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl">
            Unified navigation for every specialized computation you need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-95"
            >
              OmniSearch <Zap size={18} />
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all">
              ⌘K
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 border-b-4 border-indigo-500/50">
          <Clock className="text-indigo-400" size={24} />
          <div className="text-4xl font-black text-white mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Time</span>
        </div>

        <div className="glass rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 border-b-4 border-rose-500/50">
          <Calendar className="text-rose-400" size={24} />
          <div className="text-xl font-black text-white uppercase tracking-tight">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calendar</span>
        </div>

        <div className="glass rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 border-b-4 border-amber-500/50">
          <Cloud className="text-amber-400" size={24} />
          <div className="text-2xl font-black text-white mono">24°C</div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Local Climate</span>
        </div>

        <div className="glass rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 border-b-4 border-emerald-500/50">
          <Battery className="text-emerald-400" size={24} />
          <div className="text-2xl font-black text-white mono">82%</div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Ready</span>
        </div>

        {/* Favorites Section */}
        <div className="md:col-span-2 glass rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500">
              <Star size={20} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Favorite Engines</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favoriteTools.length > 0 ? favoriteTools.slice(0, 4).map(c => (
              <button 
                key={c.id}
                onClick={() => onSelectCalculator(c)}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <span className="text-xs font-bold text-slate-300 truncate pr-2">{c.name}</span>
                <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
              </button>
            )) : (
              <p className="col-span-2 text-[10px] text-slate-500 font-bold uppercase py-4">Star tools to see them here.</p>
            )}
          </div>
        </div>

        {/* Recents Section */}
        <div className="md:col-span-2 glass rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Clock size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Recent Activity</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentCalculators.length > 0 ? recentCalculators.map(c => c && (
              <button 
                key={c.id}
                onClick={() => onSelectCalculator(c)}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <span className="text-xs font-bold text-slate-300 truncate pr-2">{c.name}</span>
                <ChevronRight size={14} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </button>
            )) : (
              <p className="col-span-2 text-[10px] text-slate-500 font-bold uppercase py-4">No recent history.</p>
            )}
          </div>
        </div>

        <div className="lg:row-span-2 glass rounded-[2.5rem] p-8 space-y-4 flex flex-col">
          <div className="flex items-center gap-2 text-indigo-400">
            <FileText size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Brain Dump</span>
          </div>
          <textarea 
            className="flex-1 bg-transparent border-none resize-none text-sm font-medium text-slate-300 placeholder:text-slate-600 focus:ring-0 no-scrollbar leading-relaxed"
            placeholder="Start typing your ideas here..."
            value={notepad}
            onChange={(e) => setNotepad(e.target.value)}
          ></textarea>
        </div>

        <div className="md:col-span-2 lg:col-span-2 glass rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckSquare size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Task Queue</span>
            </div>
            <button 
              onClick={() => {
                const text = prompt('New task:');
                if (text) setTodos([{ id: Date.now(), text, done: false }, ...todos]);
              }}
              className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-3 max-h-[120px] overflow-y-auto no-scrollbar">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center justify-between group">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleTodo(todo.id)}
                >
                  <div className={`w-4 h-4 rounded border ${todo.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}></div>
                  <span className={`text-xs font-medium ${todo.done ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                    {todo.text}
                  </span>
                </div>
                <button 
                  onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                  className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <Bell size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Reminders</span>
          </div>
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
             <p className="text-xs text-white font-bold truncate">Upgrade to Pro</p>
          </div>
        </div>

        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="bg-indigo-600 rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-2">
            <Plus size={24} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-white">Find Tool</span>
        </button>
      </section>
    </div>
  );
};
