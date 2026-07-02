import React from 'react';

const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
