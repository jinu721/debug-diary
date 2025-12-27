import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { BugEntry } from '../types';
import { bugApi } from '../services/api';

const ReusableFixes: React.FC = () => {
  const [fixes, setFixes] = useState<BugEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadReusableFixes();
  }, []);

  const loadReusableFixes = async () => {
    try {
      setLoading(true);
      const data = await bugApi.getReusableFixes();
      setFixes(data);
    } catch (error) {
      console.error('Failed to load reusable fixes:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading reusable fixes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Reusable Fixes</h1>
            <p>Quick access to your proven solutions</p>
          </div>
        </div>

        {fixes.length === 0 ? (
          <div className="empty-state">
            <h3>No reusable fixes yet</h3>
            <p>Mark bug fixes as reusable to see them here for quick reference</p>
          </div>
        ) : (
          <div className="fixes-grid">
            {fixes.map(fix => (
              <div key={fix.id} className="fix-card">
                <div className="fix-header">
                  <h3>{fix.title}</h3>
                  <div className="fix-meta">
                    <span className="fix-date">Updated {formatDate(fix.updatedAt)}</span>
                    <a href={`/bugs/${fix.id}`} className="view-link">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {fix.technologyTags.length > 0 && (
                  <div className="fix-tags">
                    {fix.technologyTags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                {fix.rootCauseCategory && (
                  <div className="root-cause">
                    <strong>Root Cause:</strong> {fix.rootCauseCategory}
                  </div>
                )}

                {fix.fixSummary && (
                  <div className="fix-summary">
                    <h4>Summary</h4>
                    <p>{fix.fixSummary}</p>
                  </div>
                )}

                {fix.fixDocumentation && (
                  <div className="fix-documentation">
                    <div className="fix-doc-header">
                      <h4>Fix Steps</h4>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(fix.fixDocumentation!, fix.id)}
                      >
                        <Copy size={14} />
                        {copiedId === fix.id ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="fix-content">
                      <pre>{fix.fixDocumentation}</pre>
                    </div>
                  </div>
                )}

                {fix.codeSnippet && (
                  <div className="code-snippet">
                    <div className="code-header">
                      <h4>Code</h4>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(fix.codeSnippet!, `${fix.id}-code`)}
                      >
                        <Copy size={14} />
                        {copiedId === `${fix.id}-code` ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="code-block">
                      <pre><code>{fix.codeSnippet}</code></pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReusableFixes;