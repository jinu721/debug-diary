import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import BugCard from '../../components/Bug/BugCard';
import BugFilters from '../../components/Bug/BugFilters';
import Button from '../../components/UI/Button';
import { BugEntry, BugFilters as BugFiltersType } from '../../types';
import { bugApi } from '../../services/api';

const BugList: React.FC = () => {
  const [bugs, setBugs] = useState<BugEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BugFiltersType>({});

  useEffect(() => {
    loadBugs();
  }, [filters]);

  const loadBugs = async () => {
    try {
      setLoading(true);
      const data = await bugApi.getBugs(filters);
      setBugs(data);
    } catch (error) {
      console.error('Failed to load bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Bug Entries</h1>
            <p>Track and manage your debugging journey</p>
          </div>
          <Link to="/bugs/new">
            <Button>
              <Plus size={20} />
              New Bug
            </Button>
          </Link>
        </div>

        <BugFilters filters={filters} onFiltersChange={setFilters} />

        <div className="bugs-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading bugs...</p>
            </div>
          ) : bugs.length === 0 ? (
            <div className="empty-state">
              <h3>No bugs found</h3>
              <p>Start by creating your first bug entry</p>
              <Link to="/bugs/new">
                <Button>Create Bug Entry</Button>
              </Link>
            </div>
          ) : (
            bugs.map(bug => (
              <BugCard key={bug.id} bug={bug} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BugList;