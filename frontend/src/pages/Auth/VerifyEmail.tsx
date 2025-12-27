import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Bug, CheckCircle, XCircle } from 'lucide-react';
import { authApi } from '../../services/api';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Bug size={32} />
          <h1>Email Verification</h1>
        </div>

        <div className="verification-content">
          {status === 'loading' && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="success-state">
              <CheckCircle size={48} className="success-icon" />
              <p className="success-message">{message}</p>
              <p className="redirect-message">Redirecting to login...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="error-state">
              <XCircle size={48} className="error-icon" />
              <p className="error-message">{message}</p>
              <Link to="/signup" className="auth-link">
                Back to Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;