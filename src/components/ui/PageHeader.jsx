import React from 'react';

export default function PageHeader({ title, subtitle, icon, actions }) {
  return (
    <div className="mb-8 animate-fade-in-down">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
              <div className="relative w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                {icon}
              </div>
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}



