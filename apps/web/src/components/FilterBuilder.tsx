import React, { useState } from 'react';
import Card from './Card';
import { useCreateFilter } from '../hooks/api';

export interface FilterRule { 
  field: string; 
  operator: string; 
  value: string;
}

interface FilterBuilderProps {
  onClose?: () => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [rules, setRules] = useState<FilterRule[]>([{ field: '', operator: '', value: '' }]);
  const createFilterMutation = useCreateFilter();

  const addRule = () => setRules([...rules, { field: '', operator: '', value: '' }]);
  
  const updateRule = (index: number, key: keyof FilterRule, val: string) => {
    const newRules = [...rules];
    newRules[index][key] = val;
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim() || rules.length === 0) return;

    // Convert rules to JSON Logic format
    const validRules = rules.filter(rule => rule.field && rule.operator && rule.value);
    if (validRules.length === 0) return;

    // Simple JSON Logic conversion (this would be more sophisticated in practice)
    const logic = validRules.length === 1 
      ? { [validRules[0].operator]: [{ var: validRules[0].field }, validRules[0].value] }
      : { and: validRules.map(rule => ({ [rule.operator]: [{ var: rule.field }, rule.value] })) };

    try {
      await createFilterMutation.mutateAsync({
        name,
        logic,
        active: true
      });
      
      // Reset form
      setName('');
      setRules([{ field: '', operator: '', value: '' }]);
      onClose?.();
    } catch (error) {
      console.error('Failed to create filter:', error);
    }
  };

  return (
    <Card className="mb-4">
      <h2 className="text-xl font-semibold mb-4">Create Smart Filter</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Filter Name
        </label>
        <input
          type="text"
          placeholder="e.g., Tech News, Music Releases"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rules
        </label>
        {rules.map((rule, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <select
              value={rule.field}
              onChange={e => updateRule(idx, 'field', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Filter field"
            >
              <option value="">Select Field</option>
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="author">Author</option>
              <option value="source.type">Source Type</option>
            </select>
            <select
              value={rule.operator}
              onChange={e => updateRule(idx, 'operator', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Filter operator"
            >
              <option value="">Operator</option>
              <option value="==">=</option>
              <option value="in">contains</option>
              <option value="!=">!=</option>
            </select>
            <input
              type="text"
              placeholder="Value"
              value={rule.value}
              onChange={e => updateRule(idx, 'value', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded p-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Filter value"
            />
            {rules.length > 1 && (
              <button 
                onClick={() => removeRule(idx)}
                className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                aria-label="Remove rule"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button 
          onClick={addRule} 
          className="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600" 
          aria-label="Add filter rule"
        >
          Add Rule
        </button>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleSave}
          disabled={!name.trim() || createFilterMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createFilterMutation.isPending ? 'Creating...' : 'Create Filter'}
        </button>
        {onClose && (
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </Card>
  );
};

export default FilterBuilder;
