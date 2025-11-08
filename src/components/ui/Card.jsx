import React from 'react';

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/40 dark:shadow-gray-900/40 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}

export function CardBody({ className = '', children }) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}



