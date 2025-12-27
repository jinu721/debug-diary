import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import { BugFilters, Severity, RootCauseCategory } from '../../types';

interface BugFiltersProps {
  filters: BugFilters;
  onFiltersChange: (filters: BugFilters) => void;
}

const BugFiltersComponent: React.FC<BugFiltersProps> = ({ filters, onFiltersChange }) => {
  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const rootCauseOptions = [
    { value: '', label: 'All Root Causes' },
    { value: 'logic', label: 'Logic' },
    { value: 'syntax', label: 'Syntax' },
    { value: 'configuration', label: 'Configuration' },
    { value: 'dependency', label: 'Dependency' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ 
      ...filters, 
      severity: e.target.value as Severity || undefined 
    });
  };

  const handleRootCauseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ 
      ...filters, 
      rootCauseCategory: e.target.value as RootCauseCategory || undefined 
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onFiltersChange({ ...filters, technologyTags: tags.length > 0 ? tags : undefined });
  };

  const handleReusableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ 
      ...filters, 
      isReusableFix: e.target.checked ? true : undefined 
    });
  };

  return (
    <div className="bug-filters">
      <div className="filters-header">
        <Filter size={20} />
        <span>Filters</span>
      </div>

      <div className="filters-grid">
        <div className="search-input">
          <Search size={16} />
          <Input
            type="text"
            placeholder="Search bugs..."
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>

        <Select
          options={severityOptions}
          value={filters.severity || ''}
          onChange={handleSeverityChange}
        />

        <Select
          options={rootCauseOptions}
          value={filters.rootCauseCategory || ''}
          onChange={handleRootCauseChange}
        />

        <Input
          type="text"
          placeholder="Technology tags (comma-separated)"
          value={filters.technologyTags?.join(', ') || ''}
          onChange={handleTagsChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.isReusableFix || false}
            onChange={handleReusableChange}
          />
          <span>Reusable fixes only</span>
        </label>
      </div>
    </div>
  );
};

export default BugFiltersComponent;