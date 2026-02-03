
import React, { useState } from 'react';

export const CalculatorLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [display, setDisplay] = useState('1337.00');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNextValue, setWaitingForNextValue] = useState(false);

  const performCalculation = (nextValue: number) => {
    if (firstOperand === null || operator === null) return nextValue;
    
    switch (operator) {
      case '+': return firstOperand + nextValue;
      case '-': return firstOperand - nextValue;
      case '×': return firstOperand * nextValue;
      case '÷': return nextValue !== 0 ? firstOperand / nextValue : NaN;
      default: return nextValue;
    }
  };

  const handleAction = (btn: string | number) => {
    const btnStr = btn.toString();

    // Handle Numbers
    if (!isNaN(Number(btnStr))) {
      if (waitingForNextValue || display === '1337.00') {
        setDisplay(btnStr);
        setWaitingForNextValue(false);
      } else {
        setDisplay(display === '0' ? btnStr : display + btnStr);
      }
      return;
    }

    // Handle Clear
    if (btn === 'C') {
      setDisplay('0');
      setFirstOperand(null);
      setOperator(null);
      setWaitingForNextValue(false);
      return;
    }

    // Handle Decimal
    if (btn === '.') {
      if (!display.includes('.')) {
        setDisplay(display + '.');
      }
      return;
    }

    // Handle Equals
    if (btn === '=') {
      if (operator && firstOperand !== null) {
        const result = performCalculation(parseFloat(display));
        setDisplay(result.toString().slice(0, 10)); // Limit display length
        setFirstOperand(null);
        setOperator(null);
        setWaitingForNextValue(false);
      }
      return;
    }

    // Handle Operators
    const currentVal = parseFloat(display);
    if (firstOperand === null) {
      setFirstOperand(currentVal);
    } else if (operator) {
      const result = performCalculation(currentVal);
      setDisplay(result.toString().slice(0, 10));
      setFirstOperand(result);
    }
    
    setOperator(btnStr === '÷' ? '÷' : btnStr === '+' ? '+' : btnStr === '-' ? '-' : '×');
    setWaitingForNextValue(true);
  };

  const buttons = [1, 2, 3, '+', 4, 5, 6, '-', 7, 8, 9, '×', 'C', 0, '.', '÷', '='];

  return (
    <div className={`relative ${className} group`}>
      {/* 3D "Shadow" Layer */}
      <div className="absolute inset-0 bg-indigo-800 rounded-[2.5rem] translate-y-4 group-hover:translate-y-2 transition-transform duration-300"></div>
      
      {/* Main Body */}
      <div className="relative bg-indigo-500 rounded-[2.5rem] p-6 border-4 border-indigo-900 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        
        {/* Screen */}
        <div className="bg-emerald-400 border-4 border-indigo-950 h-20 rounded-xl mb-6 flex flex-col items-end justify-center px-4 shadow-inner overflow-hidden">
          <div className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest leading-none mb-1">
            {operator ? `${firstOperand} ${operator}` : 'STANDBY'}
          </div>
          <span className="mono text-2xl font-black text-indigo-950 tracking-tighter truncate w-full text-right">
            {display}
          </span>
        </div>
        
        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, i) => (
            <button 
              key={i} 
              onClick={() => handleAction(btn)}
              className={`h-10 rounded-lg border-2 border-indigo-950 flex items-center justify-center font-black text-xs shadow-[0px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0.5 active:shadow-none transition-all
                ${typeof btn === 'number' ? 'bg-indigo-300 hover:bg-indigo-200' : 
                  btn === '=' ? 'bg-rose-400 hover:bg-rose-300 col-span-4 mt-1 h-12 text-sm' : 
                  btn === 'C' ? 'bg-amber-400 hover:bg-amber-300' : 
                  'bg-indigo-400 hover:bg-indigo-300'}`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Shine Overlay */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 -skew-y-12 pointer-events-none"></div>
      </div>

      {/* Floating Elements Around */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-500 rounded-full border-4 border-indigo-950 flex items-center justify-center text-white font-black animate-float pointer-events-none">
        %
      </div>
      <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-amber-400 rounded-lg border-4 border-indigo-950 flex items-center justify-center text-indigo-950 font-black animate-float [animation-delay:1s] pointer-events-none">
        π
      </div>
    </div>
  );
};
