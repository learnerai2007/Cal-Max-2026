
import { CalculatorDef } from '../../types';

export const BASIC_ARITHMETIC: CalculatorDef = {
  id: 'math-basic',
  name: 'Standard Arithmetic',
  description: 'Clean, simple arithmetic for daily calculations with decimal precision control.',
  category: 'Math',
  icon: 'Calculator',
  inputs: [
    { id: 'num1', label: 'First Number', type: 'number', defaultValue: 10 },
    { 
      id: 'operation', 
      label: 'Operation', 
      type: 'select', 
      defaultValue: 'add', 
      options: [
        { label: 'Addition (+)', value: 'add' },
        { label: 'Subtraction (-)', value: 'subtract' },
        { label: 'Multiplication (×)', value: 'multiply' },
        { label: 'Division (÷)', value: 'divide' },
        { label: 'Remainder (%)', value: 'mod' }
      ] 
    },
    { id: 'num2', label: 'Second Number', type: 'number', defaultValue: 5 },
    { id: 'precision', label: 'Decimal Places', type: 'slider', defaultValue: 2, min: 0, max: 8 },
  ],
  calculate: (inputs) => {
    const a = Number(inputs.num1);
    const b = Number(inputs.num2);
    const op = inputs.operation;
    let result = 0;

    switch (op) {
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide': result = b !== 0 ? a / b : NaN; break;
      case 'mod': result = a % b; break;
    }

    return { result, isError: isNaN(result) || !isFinite(result) };
  },
  formatResults: (raw) => {
    if (raw.isError) return [{ id: 'res', label: 'Result', value: 'Error (Div by 0)', type: 'text', highlight: true }];
    const prec = raw.precision || 2;
    return [
      { id: 'res', label: 'Final Output', value: (raw.result as number).toFixed(prec), type: 'number', highlight: true }
    ];
  }
};
