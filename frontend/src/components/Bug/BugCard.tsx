import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, Server, Tag } from 'lucide-react';
import { BugEntry } from '../../types';

interface BugCardProps {
  bug: BugEntry;
}

const BugCard: React.FC<BugCardProps> = ({ bug }) => {
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Link to={`/bugs/${bug.id}`} className="bug-card">
      <div className="bug-card-header">
        <h3 className="bug-card-title">{bug.title}</h3>
        <div className={`severity-badge ${getSeverityColor(bug.severity)}`}>
          <AlertTriangle size={14} />
          {bug.severity}
        </div>
      </div>

      <div className="bug-card-meta">
        <div className="meta-item">
          <Server size={14} />
          <span>{bug.environment}</span>
        </div>
        <div className="meta-item">
          <Calendar size={14} />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
      </div>

      {bug.errorMessage && (
        <div className="bug-card-error">
          <code>{bug.errorMessage.substring(0, 100)}...</code>
        </div>
      )}

      {bug.technologyTags.length > 0 && (
        <div className="bug-card-tags">
          <Tag size={14} />
          <div className="tags">
            {bug.technologyTags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {bug.technologyTags.length > 3 && (
              <span className="tag">+{bug.technologyTags.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {bug.isReusableFix && (
        <div className="reusable-badge">Reusable Fix</div>
      )}

      {bug.fixedAt && (
        <div className="fixed-badge">Fixed</div>
      )}
    </Link>
  );
};

export default BugCard;