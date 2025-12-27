import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { BugEntry } from '../types';
import { bugApi } from '../services/api';

const Timeline: React.FC = () => {
  const [bugs, setBugs] = useState<BugEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      setLoading(true);
      const data = await bugApi.getBugs();
      setBugs(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const groupBugsByDate = (bugs: BugEntry[]) => {
    const groups: Record<string, BugEntry[]> = {};
    
    bugs.forEach(bug => {
      const date = formatDate(bug.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(bug);
    });

    return groups;
  };

  const calculateStats = (bugs: BugEntry[]) => {
    const total = bugs.length;
    const fixed = bugs.filter(bug => bug.fixedAt).length;
    const critical = bugs.filter(bug => bug.severity === 'critical').length;
    const reusable = bugs.filter(bug => bug.isReusableFix).length;

    return { total, fixed, critical, reusable };
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading timeline...</p>
        </div>
      </Layout>
    );
  }

  const groupedBugs = groupBugsByDate(bugs);
  const stats = calculateStats(bugs);

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Debug Timeline</h1>
            <p>Track your debugging journey and progress</p>
          </div>
        </div>

        <div className="timeline-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Bugs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.fixed}</div>
            <div className="stat-label">Fixed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.critical}</div>
            <div className="stat-label">Critical</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.reusable}</div>
            <div className="stat-label">Reusable Fixes</div>
          </div>
        </div>

        {Object.keys(groupedBugs).length === 0 ? (
          <div className="empty-state">
            <h3>No bugs tracked yet</h3>
            <p>Start creating bug entries to see your debugging timeline</p>
          </div>
        ) : (
          <div className="timeline">
            {Object.entries(groupedBugs).map(([date, dateBugs]) => (
              <div key={date} className="timeline-group">
                <div className="timeline-date">
                  <Calendar size={16} />
                  <span>{date}</span>
                </div>
                
                <div className="timeline-items">
                  {dateBugs.map(bug => (
                    <div key={bug.id} className="timeline-item">
                      <div className="timeline-marker">
                        {bug.fixedAt ? (
                          <CheckCircle size={16} className="fixed-marker" />
                        ) : (
                          <AlertTriangle size={16} className={getSeverityColor(bug.severity)} />
                        )}
                      </div>
                      
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>
                            <a href={`/bugs/${bug.id}`}>{bug.title}</a>
                          </h4>
                          <div className="timeline-time">
                            <Clock size={14} />
                            {formatTime(bug.createdAt)}
                          </div>
                        </div>
                        
                        <div className="timeline-meta">
                          <span className={`severity-badge ${getSeverityColor(bug.severity)}`}>
                            {bug.severity}
                          </span>
                          <span className="environment-badge">{bug.environment}</span>
                          {bug.isReusableFix && (
                            <span className="reusable-badge">Reusable</span>
                          )}
                        </div>

                        {bug.technologyTags.length > 0 && (
                          <div className="timeline-tags">
                            {bug.technologyTags.slice(0, 3).map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                            {bug.technologyTags.length > 3 && (
                              <span className="tag">+{bug.technologyTags.length - 3}</span>
                            )}
                          </div>
                        )}

                        {bug.fixedAt && (
                          <div className="timeline-fixed">
                            <CheckCircle size={14} />
                            Fixed on {formatDate(bug.fixedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Timeline;