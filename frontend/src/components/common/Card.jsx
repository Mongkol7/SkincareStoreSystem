import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, action, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      <h3 className="card-title">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export default Card;
