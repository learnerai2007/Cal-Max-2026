
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../Sidebar';
import { CalculatorForm } from '../CalculatorForm';
import { ResultsView } from '../ResultsView';
import { DashboardHome } from '../DashboardHome';
import { CALCULATORS } from '../../services/calculatorEngine';
import { CalculatorDef, CalculatorCategory, HistoryItem } from '../../types';
import { Search, Settings, LayoutGrid, Sparkles, ChevronRight, ArrowRight, Star, Home } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 20 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Calculator;
  return <Icon size={size} />;
};

interface DesktopViewProps {
  selectedCalculator: CalculatorDef | null;
  onSelectCalculator: (c: CalculatorDef | null) => void;
  activeCategory: CalculatorCategory | 'All';
  onSelectCategory: (c: any) => void;
  onOpenSettings: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  history: HistoryItem[];
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const DesktopView: React.FC<DesktopViewProps> = ({
  selectedCalculator,
  onSelectCalculator,
  activeCategory,
  onSelectCategory,
  onOpenSettings,
  favorites,
  onToggleFavorite,
  history,
  onAddToHistory
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedCalculator) {
      const defaults: Record<string, any> = {};
      selectedCalculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
      setInputs(defaults);
    }
  }, [selectedCalculator]);

  const results = useMemo(() => {
    if (!selectedCalculator) return null;
    try {
      const raw = selectedCalculator.calculate(inputs);
      const outputs = selectedCalculator.formatResults(raw);
      const chart = selectedCalculator.getChartData ? selectedCalculator.getChartData(raw) : null;
      return { outputs, raw, chart };
    } catch (e) {
      return null;
    }
  }, [selectedCalculator, inputs]);

  const handleInputChange = (id: string, val: any) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const filteredTools = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let base = activeCategory === 'All' ? CALCULATORS : CALCULATORS.filter(c => c.category === activeCategory);
    if (!q) return base;
    return base.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [activeCategory, searchTerm]);

  const resetToHome = () => {
    onSelectCategory('All');
    onSelectCalculator(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={onSelectCategory} 
        isOpen={true} 
        onClose={() => {}} 
        favorites={favorites}
        history={history}
        onSelectCalculator={onSelectCalculator}
      />

      <div className="flex-1 flex flex-col min-w-0 ml-72">
        <header className="h-16 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between z-30">
          <div className="flex items-center space-x-4">
             <button 
                onClick={resetToHome}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
                title="Go to Home"
             >
                <Home size={18} />
             </button>
             <div className="h-4 w-px bg-white/10" />
             <nav className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <button 
                  onClick={() => onSelectCalculator(null)}
                  className={`hover:text-white transition-colors ${!selectedCalculator ? 'text-indigo-400' : ''}`}
                >
                  {activeCategory === 'All' ? 'Dashboard' : activeCategory}
                </button>
                {selectedCalculator && (
                  <>
                    <ChevronRight size={12} className="mx-2 opacity-50" />
                    <span className="text-white normal-case tracking-normal text-xs font-extrabold">{selectedCalculator.name}</span>
                  </>
                )}
             </nav>
          </div>

          <div className="flex items-center space-x-6">
             <div className="relative group w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Press ⌘K to Search..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:ring-2 focus:ring-accent/20 outline-none transition-all cursor-pointer"
                  onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                  readOnly
                />
             </div>
             <button 
              onClick={onOpenSettings}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
             >
               <Settings size={18} className="group-hover:rotate-45 transition-transform" />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-0">
          {selectedCalculator ? (
             <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 animate-fade-up p-10">
                <div className="col-span-7 space-y-6">
                   <div className="glass rounded-3xl p-10 relative overflow-hidden">
                      <div className="flex items-center space-x-4 mb-10">
                        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                          <DynamicIcon name={selectedCalculator.icon} size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCalculator.name}</h2>
                             <button 
                                onClick={() => onToggleFavorite(selectedCalculator.id)}
                                className={`transition-colors ${favorites.includes(selectedCalculator.id) ? 'text-amber-500' : 'text-slate-600 hover:text-slate-400'}`}
                             >
                                <Star size={20} fill={favorites.includes(selectedCalculator.id) ? "currentColor" : "none"} />
                             </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{selectedCalculator.description}</p>
                        </div>
                        <button 
                          onClick={() => onSelectCalculator(null)}
                          className="ml-auto w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-accent transition-all"
                        >
                          <LayoutGrid size={20} />
                        </button>
                      </div>
                      <CalculatorForm calculator={selectedCalculator} values={inputs} onChange={handleInputChange} />
                   </div>
                </div>

                <div className="col-span-5">
                   <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 h-full">
                      <div className="flex items-center space-x-2 mb-8 opacity-60">
                         <Sparkles size={14} className="text-accent" />
                         <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Results Engine</span>
                      </div>
                      {results && (
                        <ResultsView 
                          calculator={selectedCalculator} 
                          inputs={inputs} 
                          results={results.outputs} 
                          chartConfig={results.chart} 
                        />
                      )}
                   </div>
                </div>
             </div>
          ) : activeCategory === 'All' && !searchTerm ? (
            <DashboardHome onSelectCalculator={onSelectCalculator} favorites={favorites} history={history} />
          ) : (
            <div className="max-w-6xl mx-auto animate-fade-up p-10">
               <div className="grid grid-cols-3 gap-6">
                  {filteredTools.map((calc, idx) => (
                    <button 
                      key={calc.id}
                      onClick={() => onSelectCalculator(calc)}
                      className="group glass rounded-3xl p-8 text-left hover:border-accent/50 transition-all hover:shadow-2xl hover:shadow-accent/5"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:bg-accent/10 transition-all mb-6">
                        <DynamicIcon name={calc.icon} size={24} />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-base font-bold text-white">{calc.name}</h3>
                         {favorites.includes(calc.id) && <Star size={14} className="text-amber-500" fill="currentColor" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">{calc.description}</p>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2 transition-all">
                        Launch Engine <ArrowRight size={12} className="ml-1" />
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
