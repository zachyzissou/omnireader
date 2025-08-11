import React, { useState } from 'react';
import Card from './Card';

export interface FilterRule { field: string; operator: string; value: string }

const FilterBuilder: React.FC = () => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const addRule = () => setRules([...rules, { field: '', operator: '', value: '' }]);
  const updateRule = (index: number, key: keyof FilterRule, val: string) => {
    const newRules = [...rules];
    newRules[index][key] = val;
    setRules(newRules);
  };
  return (
    <Card className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Smart Filters</h2>
      {rules.map((rule, idx) => (
        <div key={idx} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Field"
            value={rule.field}
            onChange={e => updateRule(idx, 'field', e.target.value)}
            className="border rounded p-1 flex-1"
            aria-label="Filter field"
          />
          <select
            value={rule.operator}
            onChange={e => updateRule(idx, 'operator', e.target.value)}
            className="border rounded p-1"
            aria-label="Filter operator"
          >
            <option value="">Operator</option>
            <option value="equals">=</option>
            <option value="contains">contains</option>
          </select>
          <input
            type="text"
            placeholder="Value"
            value={rule.value}
            onChange={e => updateRule(idx, 'value', e.target.value)}
            className="border rounded p-1 flex-1"
            aria-label="Filter value"
          />
        </div>
      ))}
      <button onClick={addRule} className="mt-2 p-2 bg-blue-500 text-white rounded" aria-label="Add filter rule">
        Add Rule
      </button>
    </Card>
  );
};

export default FilterBuilder;
