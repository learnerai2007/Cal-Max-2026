import { CalculatorDef } from '../../types';

export const UNIVERSAL_CONVERTER: CalculatorDef = {
  id: 'utility-universal-units',
  name: 'Universal Converter',
  description: 'Convert between metric and imperial units across multiple categories.',
  category: 'Utility',
  icon: 'ArrowLeftRight',
  inputs: [
    { id: 'category', label: 'Category', type: 'select', defaultValue: 'length', options: [
      { label: 'Length', value: 'length' },
      { label: 'Mass', value: 'mass' },
      { label: 'Temperature', value: 'temp' },
      { label: 'Volume', value: 'volume' }
    ]},
    { id: 'val', label: 'Input Value', type: 'number', defaultValue: 1 },
    { id: 'from', label: 'From', type: 'text', defaultValue: 'meters', description: 'e.g., meters, kg, celsius, liters' },
    { id: 'to', label: 'To', type: 'text', defaultValue: 'feet', description: 'e.g., feet, lbs, fahrenheit, gallons' }
  ],
  calculate: (inputs) => {
    const v = Number(inputs.val);
    const cat = inputs.category;
    const from = (inputs.from as string).toLowerCase();
    const to = (inputs.to as string).toLowerCase();
    let result = 0;

    // Simplified conversion logic for core units
    if (cat === 'length') {
      const toMeters: Record<string, number> = { meters: 1, km: 1000, cm: 0.01, feet: 0.3048, inches: 0.0254, miles: 1609.34 };
      result = (v * (toMeters[from] || 1)) / (toMeters[to] || 1);
    } else if (cat === 'temp') {
      if (from === 'celsius' && to === 'fahrenheit') result = (v * 9/5) + 32;
      else if (from === 'fahrenheit' && to === 'celsius') result = (v - 32) * 5/9;
      else result = v;
    } else if (cat === 'mass') {
      const toKg: Record<string, number> = { kg: 1, g: 0.001, lbs: 0.453592, oz: 0.0283495 };
      result = (v * (toKg[from] || 1)) / (toKg[to] || 1);
    }

    return { result, unit: to };
  },
  formatResults: (raw) => [
    { id: 'res', label: 'Result', value: (raw.result as number).toFixed(4), type: 'text', unit: raw.unit as string, highlight: true }
  ]
};