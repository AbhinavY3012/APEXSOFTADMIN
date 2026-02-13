import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';

const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-close sidebar on mobile, keep open on desktop
      if (width < 768) {
        setIsSidebarOpen(false);
      } else if (width >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Touch gesture handling for mobile sidebar
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    if (isRightSwipe && !isSidebarOpen && touchStart < 50) {
      setIsSidebarOpen(true);
    }
  };

  const navigation = [
    {
      name: 'Home',
      href: '/home',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
        </svg>
      ),
    },
    {
      name: 'Services',
      href: '/services',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
        </svg>
      ),
    },

    {
      name: 'Job Openings',
      href: '/job-openings',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm120,24V88H40V72Zm0,128H40V104H216v96Z"></path>
        </svg>
      ),
    },
    {
      name: 'Internship Programs',
      href: '/internship-programs',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
        </svg>
      ),
    },
    {
      name: 'Contact Management',
      href: '/contact-management',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
      ),
    },
    {
      name: 'Project Quotation',
      href: '/project-quotation',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M200,168a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,168Zm-8-40H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm56-64V208a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48H80V32a16,16,0,0,1,16-16h64a16,16,0,0,1,16,16V48h48A16,16,0,0,1,248,64ZM96,48h64V32H96ZM232,64H32V208H232ZM136,112a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8Zm-16,40H96V120h24Z"></path>
        </svg>
      ),
    },
    {
      name: 'Project Management',
      href: '/project-management',
      icon: (
        <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-16,160H56V56h144ZM88,80H72v96h16Zm48,0H120v96h16Zm48,0H168v96h16Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div 
      className="flex h-screen relative overflow-hidden bg-background-light dark:bg-background-dark"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Overlay */}
      {(isMobile || isTablet) && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ease-out"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 lg:z-auto
        flex flex-col h-full
        bg-gradient-to-b from-white to-gray-50
        border-r border-gray-200
        shadow-2xl lg:shadow-lg
        transform transition-all duration-300 ease-out
        ${isMobile ? 'w-80' : isTablet ? 'w-72' : 'w-64'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isSidebarOpen && !isMobile && !isTablet ? 'lg:w-16' : ''}
      `}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-3 transform transition-all duration-500 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <svg className="relative h-8 w-8 text-blue-600 transition-transform duration-300 hover:rotate-12" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M158.9,89.16l-32-18-32,18L26.3,121.84,128,183.33l101.7-61.49ZM128,34,32.23,92.4,128,150.8,223.77,92.4ZM232,104.75v50.5a8,8,0,0,1-4.37,7.26l-96,54.86a7.9,7.9,0,0,1-7.26,0l-96-54.86A8,8,0,0,1,24,155.25v-50.5a8,8,0,0,1,4.37-7.26L52,83.17V144a8,8,0,0,0,16,0V100.8l52.37,29.93a8,8,0,0,0,7.26,0L180,100.8V144a8,8,0,0,0,16,0V83.17l23.63,14.32A8,8,0,0,1,232,104.75Z"></path>
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce shadow-lg"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ApexAdmin
            </h1>
          </div>
          
          {/* Close Button for Mobile/Tablet */}
          {(isMobile || isTablet) && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/50 transition-all duration-200 transform hover:scale-110 lg:hidden"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Desktop Toggle Button */}
          {!isMobile && !isTablet && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/50 transition-all duration-200 transform hover:scale-110 hidden lg:block"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => (isMobile || isTablet) && setIsSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl font-medium
                  transition-all duration-300 ease-out
                  relative overflow-hidden
                  transform hover:translate-x-1 active:scale-95
                  touch-friendly
                  ${isMobile ? 'px-4 py-4 text-base' : isTablet ? 'px-4 py-3.5 text-sm' : 'px-4 py-3 text-sm'}
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isActive ? 'opacity-0' : ''}
                `}></div>
                
                {/* Icon with animation */}
                <div className={`
                  relative z-10 transition-all duration-300
                  ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110 group-hover:rotate-3'}
                `}>
                  {item.icon}
                </div>
                
                {/* Text */}
                <span className={`
                  relative z-10 transition-all duration-300
                  ${isActive ? 'font-semibold drop-shadow-sm' : 'group-hover:font-medium'}
                `}>
                  {item.name}
                </span>
                
                {/* Success indicator for active items */}
                {isActive && (
                  <div className="relative z-10 ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        {/* Footer Actions */}
        <div className="mt-auto p-4 space-y-2 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">

          
          <Link
            to="/settings"
            onClick={() => (isMobile || isTablet) && setIsSidebarOpen(false)}
            className={`group flex items-center gap-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 touch-friendly ${isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3 text-sm'} ${
              location.pathname === '/settings'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-700 hover:shadow-md'
            }`}
          >
            <div className={`transition-transform duration-300 ${location.pathname === '/settings' ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
              <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
            </div>
            <span className={`transition-all duration-300 ${location.pathname === '/settings' ? 'font-semibold' : 'group-hover:translate-x-1 group-hover:font-medium'}`}>Settings</span>
          </Link>
          
          <button
            onClick={onLogout}
            className={`group flex w-full items-center gap-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 touch-friendly ${isMobile ? 'px-4 py-4 text-base' : 'px-4 py-3 text-sm'}`}
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
              <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
              </svg>
            </div>
            <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <NotificationCenter />
             <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                   A
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
             </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-lg backdrop-blur-sm relative z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="group p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
          >
            <div className="relative">
              <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 256 256">
                <path d="M158.9,89.16l-32-18-32,18L26.3,121.84,128,183.33l101.7-61.49ZM128,34,32.23,92.4,128,150.8,223.77,92.4ZM232,104.75v50.5a8,8,0,0,1-4.37,7.26l-96,54.86a7.9,7.9,0,0,1-7.26,0l-96-54.86A8,8,0,0,1,24,155.25v-50.5a8,8,0,0,1,4.37-7.26L52,83.17V144a8,8,0,0,0,16,0V100.8l52.37,29.93a8,8,0,0,0,7.26,0L180,100.8V144a8,8,0,0,0,16,0V83.17l23.63,14.32A8,8,0,0,1,232,104.75Z"></path>
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ApexAdmin</span>
          </div>
          
          <div className="flex items-center gap-2">
             <NotificationCenter />
          </div>
        </header>
        
        {/* Page Content with keyed transition */}
        <div 
          key={location.pathname} 
          className={`flex-1 overflow-y-auto animate-fade-in-up ${isMobile ? 'mobile-padding mobile-text' : isTablet ? 'tablet-optimized tablet-text' : 'desktop-optimized'}`}
        >
           <div className="pt-2 lg:pt-0">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
