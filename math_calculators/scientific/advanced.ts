
import { CalculatorDef } from '../../types';

export const SCIENTIFIC_ADVANCED: CalculatorDef = {
  id: 'math-scientific',
  name: 'Scientific Advanced',
  description: 'Logarithms, exponents, roots, and factorial operations for advanced research.',
  category: 'Math',
  icon: 'Atom',
  inputs: [
    { id: 'val', label: 'Input Value (x)', type: 'number', defaultValue: 10 },
    { 
      id: 'fn', 
      label: 'Function', 
      type: 'select', 
      defaultValue: 'log', 
      options: [
        { label: 'Log10 (log)', value: 'log' },
        { label: 'Natural Log (ln)', value: 'ln' },
        { label: 'Square Root (√)', value: 'sqrt' },
        { label: 'Factorial (x!)', value: 'fact' },
        { label: 'e^x', value: 'exp' },
        { label: 'x²', value: 'sq' }
      ] 
    },
  ],
  calculate: (inputs) => {
    const x = Number(inputs.val);
    const fn = inputs.fn;
    let res = 0;

    const factorial = (n: number): number => {
      if (n < 0) return NaN;
      if (n === 0) return 1;
      let r = 1;
      for (let i = 2; i <= Math.min(n, 170); i++) r *= i;
      return r;
    };

    switch (fn) {
      case 'log': res = Math.log10(x); break;
      case 'ln': res = Math.log(x); break;
      case 'sqrt': res = Math.sqrt(x); break;
      case 'fact': res = factorial(Math.floor(x)); break;
      case 'exp': res = Math.exp(x); break;
      case 'sq': res = x * x; break;
    }

    return { res, overflow: res > 1e15 };
  },
  formatResults: (raw) => [
    { id: 'res', label: 'Computed Value', value: typeof raw.res === 'number' && !isNaN(raw.res) ? (raw.res as number).toLocaleString() : 'Error', type: 'text', highlight: true }
  ]
};
