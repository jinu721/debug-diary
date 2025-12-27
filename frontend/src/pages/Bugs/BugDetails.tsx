import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Calendar, Server, AlertTriangle, Tag, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { BugEntry } from '../../types';
import { bugApi } from '../../services/api';

const BugDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<BugEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadBug();
    }
  }, [id]);

  const loadBug = async () => {
    try {
      setLoading(true);
      const data = await bugApi.getBugById(id!);
      setBug(data);
    } catch (error) {
      console.error('Failed to load bug:', error);
      navigate('/bugs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await bugApi.deleteBug(id!);
      navigate('/bugs');
    } catch (error) {
      console.error('Failed to delete bug:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-low';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bug details...</p>
        </div>
      </Layout>
    );
  }

  if (!bug) {
    return (
      <Layout>
        <div className="error-state">
          <h2>Bug not found</h2>
          <Link to="/bugs">
            <Button>Back to Bugs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="header-nav">
            <Link to="/bugs" className="back-link">
              <ArrowLeft size={20} />
              Back to Bugs
            </Link>
          </div>
          <div className="header-actions">
            <Link to={`/bugs/${id}/edit`}>
              <Button variant="secondary">
                <Edit size={16} />
                Edit
              </Button>
            </Link>
            <Button 
              variant="danger" 
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>

        <div className="bug-details">
          <div className="bug-header">
            <h1>{bug.title}</h1>
            <div className="bug-meta">
              <div className={`severity-badge ${getSeverityColor(bug.severity)}`}>
                <AlertTriangle size={16} />
                {bug.severity}
              </div>
              <div className="meta-item">
                <Server size={16} />
                {bug.environment}
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                Created {formatDate(bug.createdAt)}
              </div>
              {bug.fixedAt && (
                <div className="fixed-badge">
                  <CheckCircle size={16} />
                  Fixed {formatDate(bug.fixedAt)}
                </div>
              )}
            </div>
          </div>

          {bug.technologyTags.length > 0 && (
            <div className="section">
              <h3>
                <Tag size={18} />
                Technologies
              </h3>
              <div className="tags">
                {bug.technologyTags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="section">
            <h3>Bug Details</h3>
            <div className="content-block">
              <pre>{bug.bugDetails}</pre>
            </div>
          </div>

          {bug.codeSnippet && (
            <div className="section">
              <h3>Code Snippet</h3>
              <div className="code-block">
                <pre><code>{bug.codeSnippet}</code></pre>
              </div>
            </div>
          )}

          {bug.errorMessage && (
            <div className="section">
              <h3>Error Message</h3>
              <div className="error-block">
                <pre><code>{bug.errorMessage}</code></pre>
              </div>
            </div>
          )}

          {bug.rootCauseExplanation && (
            <div className="section">
              <h3>Root Cause Analysis</h3>
              {bug.rootCauseCategory && (
                <div className="root-cause-category">
                  Category: <span className="category-badge">{bug.rootCauseCategory}</span>
                </div>
              )}
              <div className="content-block">
                <pre>{bug.rootCauseExplanation}</pre>
              </div>
            </div>
          )}

          {bug.fixDocumentation && (
            <div className="section">
              <h3>Fix Documentation</h3>
              {bug.isReusableFix && (
                <div className="reusable-badge">Marked as Reusable</div>
              )}
              <div className="content-block">
                <pre>{bug.fixDocumentation}</pre>
              </div>
            </div>
          )}

          {bug.fixSummary && (
            <div className="section">
              <h3>Fix Summary</h3>
              <div className="content-block">
                <pre>{bug.fixSummary}</pre>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Bug Entry"
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this bug entry? This action cannot be undone.</p>
            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default BugDetails;