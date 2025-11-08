import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RoutingTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const testRoutes = [
    '/home',
    '/services', 
    '/about',
    '/portfolio',
    '/job-openings',
    '/internship-programs',
    '/contact',
    '/settings'
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Routing Test Panel
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current Location: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{location.pathname}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {testRoutes.map((route) => (
          <button
            key={route}
            onClick={() => navigate(route)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === route
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {route}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click any button above to test navigation. Current route will be highlighted.
        </p>
      </div>
    </div>
  );
};

export default RoutingTest;
