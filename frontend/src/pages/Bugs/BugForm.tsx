import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Textarea from '../../components/UI/Textarea';
import { Environment, Severity, RootCauseCategory, CreateBugData, UpdateBugData } from '../../types';
import { bugApi } from '../../services/api';

const BugForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    environment: 'local' as Environment,
    severity: 'medium' as Severity,
    codeSnippet: '',
    errorMessage: '',
    bugDetails: '',
    rootCauseExplanation: '',
    rootCauseCategory: '' as RootCauseCategory | '',
    fixDocumentation: '',
    fixSummary: '',
    technologyTags: '',
    isReusableFix: false,
    markAsFixed: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      loadBug();
    }
  }, [id, isEdit]);

  const loadBug = async () => {
    try {
      const bug = await bugApi.getBugById(id!);
      setFormData({
        title: bug.title,
        environment: bug.environment,
        severity: bug.severity,
        codeSnippet: bug.codeSnippet || '',
        errorMessage: bug.errorMessage || '',
        bugDetails: bug.bugDetails,
        rootCauseExplanation: bug.rootCauseExplanation || '',
        rootCauseCategory: bug.rootCauseCategory || '',
        fixDocumentation: bug.fixDocumentation || '',
        fixSummary: bug.fixSummary || '',
        technologyTags: bug.technologyTags.join(', '),
        isReusableFix: bug.isReusableFix,
        markAsFixed: !!bug.fixedAt,
      });
    } catch (error) {
      console.error('Failed to load bug:', error);
      navigate('/bugs');
    }
  };

  const environmentOptions = [
    { value: 'local', label: 'Local' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
    { value: 'other', label: 'Other' },
  ];

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const rootCauseOptions = [
    { value: '', label: 'Select root cause category' },
    { value: 'logic', label: 'Logic Error' },
    { value: 'syntax', label: 'Syntax Error' },
    { value: 'configuration', label: 'Configuration Issue' },
    { value: 'dependency', label: 'Dependency Problem' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.bugDetails.trim()) {
      newErrors.bugDetails = 'Bug details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const tags = formData.technologyTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      if (isEdit) {
        const updateData: UpdateBugData = {
          title: formData.title,
          environment: formData.environment,
          severity: formData.severity,
          codeSnippet: formData.codeSnippet || undefined,
          errorMessage: formData.errorMessage || undefined,
          bugDetails: formData.bugDetails,
          rootCauseExplanation: formData.rootCauseExplanation || undefined,
          rootCauseCategory: formData.rootCauseCategory || undefined,
          fixDocumentation: formData.fixDocumentation || undefined,
          fixSummary: formData.fixSummary || undefined,
          technologyTags: tags,
          isReusableFix: formData.isReusableFix,
          fixedAt: formData.markAsFixed ? new Date() : undefined,
        };

        await bugApi.updateBug(id!, updateData);
      } else {
        const createData: CreateBugData = {
          title: formData.title,
          environment: formData.environment,
          severity: formData.severity,
          codeSnippet: formData.codeSnippet || undefined,
          errorMessage: formData.errorMessage || undefined,
          bugDetails: formData.bugDetails,
          technologyTags: tags,
        };

        await bugApi.createBug(createData);
      }

      navigate('/bugs');
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.error || 'Failed to save bug' });
    } finally {
      setLoading(false);
    }
  };

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
          <h1>{isEdit ? 'Edit Bug Entry' : 'New Bug Entry'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bug-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <Input
                name="title"
                label="Bug Title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />

              <Select
                name="environment"
                label="Environment"
                options={environmentOptions}
                value={formData.environment}
                onChange={handleChange}
                required
              />

              <Select
                name="severity"
                label="Severity"
                options={severityOptions}
                value={formData.severity}
                onChange={handleChange}
                required
              />

              <Input
                name="technologyTags"
                label="Technology Tags (comma-separated)"
                placeholder="React, Node.js, MongoDB"
                value={formData.technologyTags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Bug Description</h3>
            <Textarea
              name="bugDetails"
              label="Bug Details"
              value={formData.bugDetails}
              onChange={handleChange}
              error={errors.bugDetails}
              rows={6}
              required
            />

            <Textarea
              name="codeSnippet"
              label="Code Snippet (optional)"
              value={formData.codeSnippet}
              onChange={handleChange}
              rows={8}
              className="code-textarea"
            />

            <Textarea
              name="errorMessage"
              label="Error Message (optional)"
              value={formData.errorMessage}
              onChange={handleChange}
              rows={4}
              className="code-textarea"
            />
          </div>

          <div className="form-section">
            <h3>Root Cause Analysis</h3>
            <Select
              name="rootCauseCategory"
              label="Root Cause Category"
              options={rootCauseOptions}
              value={formData.rootCauseCategory}
              onChange={handleChange}
            />

            <Textarea
              name="rootCauseExplanation"
              label="Root Cause Explanation"
              value={formData.rootCauseExplanation}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-section">
            <h3>Fix Documentation</h3>
            <Textarea
              name="fixDocumentation"
              label="Step-by-step Fix"
              value={formData.fixDocumentation}
              onChange={handleChange}
              rows={6}
            />

            <Textarea
              name="fixSummary"
              label="Fix Summary"
              value={formData.fixSummary}
              onChange={handleChange}
              rows={3}
            />

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isReusableFix"
                  checked={formData.isReusableFix}
                  onChange={handleChange}
                />
                <span>Mark as reusable fix</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="markAsFixed"
                  checked={formData.markAsFixed}
                  onChange={handleChange}
                />
                <span>Mark as fixed</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : isEdit ? 'Update Bug' : 'Create Bug'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BugForm;