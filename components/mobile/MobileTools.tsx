
import React, { useState, useMemo } from 'react';
import { CalculatorDef, CalculatorCategory } from '../../types';
import { CALCULATORS } from '../../services/calculatorEngine';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  TrendingUp, 
  Activity, 
  Calculator as CalcIcon, 
  Cpu, 
  Settings, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 18 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Calculator;
  return <Icon size={size} />;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Finance': <TrendingUp size={18} className="text-emerald-400" />,
  'Health': <Activity size={18} className="text-rose-400" />,
  'Math': <CalcIcon size={18} className="text-indigo-400" />,
  'Engineering': <Cpu size={18} className="text-amber-400" />,
  'Utility': <Settings size={18} className="text-slate-400" />,
};

interface MobileToolsProps {
  onSelectCalculator: (calc: CalculatorDef) => void;
}

export const MobileTools: React.FC<MobileToolsProps> = ({ onSelectCalculator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['Finance', 'Math']));

  const groupedCalculators = useMemo(() => {
    const groups: Record<string, CalculatorDef[]> = {};
    const query = searchQuery.toLowerCase();

    CALCULATORS.forEach(calc => {
      if (
        query && 
        !calc.name.toLowerCase().includes(query) && 
        !calc.description.toLowerCase().includes(query)
      ) return;

      if (!groups[calc.category]) groups[calc.category] = [];
      groups[calc.category].push(calc);
    });
    return groups;
  }, [searchQuery]);

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCats);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCats(next);
  };

  const categories = Object.keys(groupedCalculators).sort();

  return (
    <div className="animate-fade-in flex flex-col h-full bg-slate-950">
      {/* Search Header */}
      <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30 px-6 py-4 border-b border-white/5">
        <div className="relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search toolkits..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8 space-y-4 pb-32">
        {categories.length > 0 ? (
          categories.map(cat => {
            const isOpen = expandedCats.has(cat) || searchQuery !== '';
            const calcs = groupedCalculators[cat];

            return (
              <div key={cat} className="space-y-2">
                {/* Category Node */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isOpen ? 'bg-white/5 border border-white/10' : 'bg-transparent border border-transparent'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${isOpen ? 'bg-slate-900' : 'bg-transparent border border-white/5'}`}>
                      {CATEGORY_ICONS[cat] || <CalcIcon size={18} />}
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white">{cat}</span>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{calcs.length} Tools</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={16} className="text-indigo-500" /> : <Plus size={16} className="text-slate-600" />}
                  </div>
                </button>

                {/* Leaves (Calculators) */}
                {isOpen && (
                  <div className="grid grid-cols-1 gap-2 pl-4 border-l border-white/5 ml-6 py-2">
                    {calcs.map((calc, idx) => (
                      <button
                        key={calc.id}
                        onClick={() => onSelectCalculator(calc)}
                        className="flex items-center space-x-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl active:bg-indigo-500/10 active:border-indigo-500/20 transition-all text-left animate-fade-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="w-9 h-9 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                          <DynamicIcon name={calc.icon} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{calc.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 leading-tight">{calc.description}</p>
                        </div>
                        <div className="text-slate-700">
                          <ChevronRight size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-700">
               <Search size={32} />
            </div>
            <p className="text-sm font-bold text-slate-500">No matching toolkits found</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-4 py-2 bg-indigo-500/10 rounded-lg"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
