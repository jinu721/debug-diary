import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea 
        className={`textarea ${error ? 'textarea--error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Textarea;