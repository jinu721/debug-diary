import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { authApi } from '../../services/api';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authApi.signup(formData.email, formData.password);
      setMessage(response.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.error || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <Bug size={32} />
            <h1>Check Your Email</h1>
          </div>
          <p className="success-message">{message}</p>
          <Link to="/login" className="auth-link">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Bug size={32} />
          <h1>Create Account</h1>
          <p>Start tracking and solving bugs efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;