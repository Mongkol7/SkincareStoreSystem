import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="input-label">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'border-danger-500 focus:ring-danger-400' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-danger-300">{error}</p>
      )}
    </div>
  );
};

export default Input;
