import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from './Card';

export interface FilterRule {
  id: number | string;
  field: string;
  operator: string;
  value: string;
  status?: 'idle' | 'saving' | 'error';
  error?: string;
  isNew?: boolean;
  isDirty?: boolean;
}

const OPERATOR_OPTIONS = [
  { value: 'equals', label: '=' },
  { value: 'contains', label: 'contains' },
];

const createLocalFilter = (): FilterRule => ({
  id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  field: '',
  operator: 'equals',
  value: '',
  isNew: true,
  isDirty: true,
  status: 'idle',
});

const normalizeFilter = (filter: any): FilterRule => ({
  id: filter.id,
  field: filter.field ?? '',
  operator: OPERATOR_OPTIONS.some(opt => opt.value === filter.operator)
    ? filter.operator
    : 'equals',
  value: filter.value ?? '',
  status: 'idle',
  isDirty: false,
});

const FilterBuilder: React.FC = () => {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/filters');
      if (!response.ok) {
        throw new Error('Failed to load filters');
      }
      const payload = await response.json();
      setFilters(payload.map(normalizeFilter));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load filters';
      setLoadError(message);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const updateFilter = useCallback((id: FilterRule['id'], key: keyof FilterRule, value: string) => {
    setFilters(prev => prev.map(filter => {
      if (filter.id !== id) return filter;
      return {
        ...filter,
        [key]: value,
        isDirty: true,
        error: undefined,
      };
    }));
  }, []);

  const persistFilter = useCallback(async (id: FilterRule['id']) => {
    const filterToSave = filters.find(filter => filter.id === id);
    if (!filterToSave) return;

    const payload = {
      field: filterToSave.field.trim(),
      operator: filterToSave.operator,
      value: filterToSave.value.trim(),
    };

    setFilters(prev => prev.map(filter => filter.id === id
      ? { ...filter, status: 'saving', error: undefined }
      : filter,
    ));

    const endpoint = filterToSave.isNew ? '/api/filters' : `/api/filters/${filterToSave.id}`;
    const method = filterToSave.isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.message || 'Failed to save filter';
        throw new Error(message);
      }

      const saved = await response.json();

      setFilters(prev => prev.map(filter => filter.id === id
        ? {
            ...normalizeFilter(saved),
            status: 'idle',
          }
        : filter,
      ));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save filter';
      setFilters(prev => prev.map(filter => filter.id === id
        ? { ...filter, status: 'error', error: message }
        : filter,
      ));
    }
  }, [filters]);

  const deleteFilter = useCallback(async (id: FilterRule['id']) => {
    const filterToDelete = filters.find(filter => filter.id === id);
    if (!filterToDelete) return;

    if (filterToDelete.isNew) {
      setFilters(prev => prev.filter(filter => filter.id !== id));
      return;
    }

    setFilters(prev => prev.map(filter => filter.id === id
      ? { ...filter, status: 'saving', error: undefined }
      : filter,
    ));

    try {
      const response = await fetch(`/api/filters/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.message || 'Failed to delete filter';
        throw new Error(message);
      }

      setFilters(prev => prev.filter(filter => filter.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete filter';
      setFilters(prev => prev.map(filter => filter.id === id
        ? { ...filter, status: 'error', error: message }
        : filter,
      ));
    }
  }, [filters]);

  const addFilter = useCallback(() => {
    setFilters(prev => [...prev, createLocalFilter()]);
  }, []);

  const canAdd = useMemo(() => !filters.some(filter => filter.isNew && !filter.isDirty), [filters]);

  const renderFilterRow = (filter: FilterRule) => {
    const isSaving = filter.status === 'saving';
    const hasError = filter.status === 'error';
    const canSave = Boolean(
      filter.field.trim() &&
      filter.operator &&
      filter.value.trim() &&
      filter.isDirty &&
      !isSaving,
    );

    return (
      <div key={filter.id} className="flex flex-col gap-2 mb-3 border border-gray-200 dark:border-gray-700 rounded p-3">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 gap-2">
          <input
            type="text"
            placeholder="Field"
            value={filter.field}
            onChange={e => updateFilter(filter.id, 'field', e.target.value)}
            className="border rounded p-2 flex-1"
            aria-label="Filter field"
            disabled={isSaving}
          />
          <select
            value={filter.operator}
            onChange={e => updateFilter(filter.id, 'operator', e.target.value)}
            className="border rounded p-2 md:w-40"
            aria-label="Filter operator"
            disabled={isSaving}
          >
            {OPERATOR_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Value"
            value={filter.value}
            onChange={e => updateFilter(filter.id, 'value', e.target.value)}
            className="border rounded p-2 flex-1"
            aria-label="Filter value"
            disabled={isSaving}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 h-5" role="status">
            {isSaving && 'Saving...'}
            {hasError && <span className="text-red-500">{filter.error}</span>}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => persistFilter(filter.id)}
              className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
              disabled={!canSave}
            >
              Save
            </button>
            <button
              onClick={() => deleteFilter(filter.id)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100"
              disabled={isSaving}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Smart Filters</h2>
        <button
          onClick={addFilter}
          className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
          aria-label="Add filter rule"
          disabled={!canAdd}
        >
          Add Rule
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading filters...</p>}
      {loadError && !loading && (
        <div className="mb-3 text-sm text-red-500" role="alert">
          {loadError}
        </div>
      )}

      {!loading && filters.length === 0 && (
        <p className="text-sm text-gray-500">No filters yet. Create one to start curating content.</p>
      )}

      {filters.map(renderFilterRow)}
    </Card>
  );
};

export default FilterBuilder;
