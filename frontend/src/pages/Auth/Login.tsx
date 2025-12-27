import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      const response = await authApi.login(formData.email, formData.password);
      login(response.token, response.user);
      navigate('/bugs');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      if (errorMessage.includes('verify')) {
        setErrors({ submit: 'Please verify your email before logging in. Check your inbox.' });
      } else {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Bug size={32} />
          <h1>Welcome Back</h1>
          <p>Sign in to your debug diary</p>
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

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;