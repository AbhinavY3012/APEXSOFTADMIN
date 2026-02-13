import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  useAppDevelopmentRequests, 
  useIOSDevelopmentRequests, 
  useWebDevelopmentRequests, 
  useJobApplications, 
  useInternshipApplications, 
  useContacts
} from '../hooks/useFirebaseData';
import { formatDate } from '../utils/dateUtils';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch data
  const { data: appRequests } = useAppDevelopmentRequests();
  const { data: iosRequests } = useIOSDevelopmentRequests();
  const { data: webRequests } = useWebDevelopmentRequests();
  const { data: jobApplications } = useJobApplications();
  const { data: internshipApplications } = useInternshipApplications();
  const { data: contacts } = useContacts();

  // Aggregate notifications
  const notifications = [
    ...(appRequests || []).filter(r => r.status === 'new').map(r => ({
      id: r.id,
      type: 'App Request',
      title: 'New App Development Request',
      message: `Request from ${r.clientName}`,
      date: r.submittedAt,
      link: '/app-development-requests',
      icon: '📱',
      color: 'bg-blue-100 text-blue-600'
    })),
    ...(iosRequests || []).filter(r => r.status === 'new').map(r => ({
      id: r.id,
      type: 'iOS Request',
      title: 'New iOS Development Request',
      message: `Request from ${r.clientName}`,
      date: r.submittedAt,
      link: '/app-development-requests', 
      icon: '🍎',
      color: 'bg-gray-100 text-gray-800'
    })),
    ...(webRequests || []).filter(r => r.status === 'new').map(r => ({
      id: r.id,
      type: 'Web Request',
      title: 'New Web Development Request',
      message: `Request from ${r.clientName}`,
      date: r.submittedAt,
      link: '/app-development-requests', // Assuming combined or similar route
      icon: '🌐',
      color: 'bg-indigo-100 text-indigo-600'
    })),
    ...(jobApplications || []).filter(a => a.status === 'pending').map(a => ({
      id: a.id,
      type: 'Job Application',
      title: `Application: ${a.position}`,
      message: `Applicant: ${a.name}`,
      date: a.submittedAt,
      link: '/job-openings',
      icon: '💼',
      color: 'bg-purple-100 text-purple-600'
    })),
    ...(internshipApplications || []).filter(a => a.status === 'pending').map(a => ({
      id: a.id,
      type: 'Internship',
      title: `Internship: ${a.program}`,
      message: `Applicant: ${a.name}`,
      date: a.submittedAt,
      link: '/internship-programs',
      icon: '🎓',
      color: 'bg-pink-100 text-pink-600'
    })),
    ...(contacts || []).filter(c => c.status === 'new').map(c => ({
      id: c.id,
      type: 'Contact',
      title: 'New Inquiry',
      message: c.subject,
      date: c.submittedAt,
      link: '/contact-management',
      icon: '✉️',
      color: 'bg-green-100 text-green-600'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const unreadCount = notifications.length;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="sr-only">View notifications</span>
        <svg 
          className="h-6 w-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-up">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                      <span className="text-lg">{notification.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <Link 
              to="/home" 
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All Activity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
