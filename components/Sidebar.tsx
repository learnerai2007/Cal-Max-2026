
import React from 'react';
import { 
  TrendingUp, Activity, Settings, PieChart, Cpu, 
  Zap, Box, BrainCircuit, Star, Clock, Trash2, Calculator
} from 'lucide-react';
import { CalculatorCategory, CalculatorDef } from '../types';
import { CALCULATORS } from '../services/calculatorEngine';

interface SidebarProps {
  activeCategory: string | 'All';
  onSelectCategory: (cat: string | 'All') => void;
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  history: any[];
  onSelectCalculator: (c: CalculatorDef) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory, 
  isOpen, 
  onClose,
  favorites,
  history,
  onSelectCalculator
}) => {
  const categories: { id: CalculatorCategory | 'All', label: string, icon: React.ReactNode }[] = [
    { id: 'All', label: 'All Tools', icon: <Box size={18} /> },
    { id: 'Finance', label: 'Finance', icon: <TrendingUp size={18} /> },
    { id: 'Health', label: 'Health', icon: <Activity size={18} /> },
    { id: 'Math', label: 'Math', icon: <Calculator size={18} /> },
    { id: 'Engineering', label: 'Engineering', icon: <Cpu size={18} /> },
    { id: 'Utility', label: 'Utility', icon: <Settings size={18} /> },
    { id: 'Advanced', label: 'Advanced', icon: <BrainCircuit size={18} /> },
  ];

  const favoriteTools = CALCULATORS.filter(c => favorites.includes(c.id));
  const recentTools = history
    .map(h => CALCULATORS.find(c => c.id === h.calculatorId))
    .filter((c, i, self) => c && self.findIndex(t => t?.id === c.id) === i)
    .slice(0, 3);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-bg border-r border-slate-200 dark:border-slate-800 z-50
        transition-transform duration-300 ease-in-out flex flex-col overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 shrink-0">
          <div className="flex items-center space-x-2 group cursor-pointer mb-8" onClick={() => onSelectCategory('All')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
               <Zap size={18} />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tighter uppercase">Cal Max</span>
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Library</div>
          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all relative
                  ${activeCategory === cat.id 
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/20' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'}
                `}
              >
                {activeCategory === cat.id && (
                  <div className="absolute left-0 w-1 h-4 bg-indigo-600 rounded-r-full" />
                )}
                <span className="opacity-70">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-8">
          {favoriteTools.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 px-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Star size={12} className="text-amber-500" />
                <span>Favorites</span>
              </div>
              <div className="space-y-1">
                {favoriteTools.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => onSelectCalculator(tool)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg truncate transition-colors"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </section>
          )}

          {recentTools.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 px-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock size={12} className="text-indigo-500" />
                <span>Recent</span>
              </div>
              <div className="space-y-1">
                {recentTools.map(tool => tool && (
                  <button 
                    key={tool.id} 
                    onClick={() => onSelectCalculator(tool)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg truncate transition-colors"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-900 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
             <span>Shortcuts</span>
             <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[8px]">⌘K</kbd>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
             <p className="text-[10px] text-slate-400 mb-3">Press ⌘K to quickly search and launch any tool.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
