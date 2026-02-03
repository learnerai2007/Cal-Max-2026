
import React from 'react';
import { CalculatorDef, CalculatorInput } from '../types';
import { TextField, SliderField } from './ui/Input';

interface CalculatorFormProps {
  calculator: CalculatorDef;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ calculator, values, onChange }) => {
  const renderInput = (input: CalculatorInput, index: number) => {
    const commonProps = {
      key: input.id,
      label: input.label,
      className: "animate-fade-up",
      style: { animationDelay: `${index * 0.05}s` }
    };

    switch (input.type) {
      case 'slider':
        return (
          <SliderField
            {...commonProps}
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, Number(e.target.value))}
          />
        );
      case 'select':
        return (
          <div key={input.id} className={`flex flex-col space-y-2 ${commonProps.className}`} style={commonProps.style}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              {input.label}
            </label>
            <select
              value={values[input.id] ?? input.defaultValue}
              onChange={(e) => onChange(input.id, e.target.value)}
              className="block w-full rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all hover:bg-slate-900"
            >
              {input.options?.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
              ))}
            </select>
          </div>
        );
      case 'date':
        return (
          <TextField
            {...commonProps}
            type="date"
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
      default:
        const isNumeric = input.type === 'number' || input.type === 'currency';
        return (
          <TextField
            {...commonProps}
            type={isNumeric ? 'number' : 'text'}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => {
              const val = e.target.value;
              onChange(input.id, isNumeric ? (val === '' ? '' : Number(val)) : val);
            }}
            placeholder={input.description}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {calculator.inputs.map((input, idx) => renderInput(input, idx))}
      </div>
    </div>
  );
};
