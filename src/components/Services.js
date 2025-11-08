import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDevelopmentRequests, useIOSDevelopmentRequests, useWebDevelopmentRequests, useFirebaseCRUD } from '../hooks/useFirebaseData';
import dataService from '../services/dataService';
import { formatDate } from '../utils/dateUtils';

const Services = () => {
  // Firebase hooks for development requests
  const { data: appRequests, loading: appRequestsLoading, error: appRequestsError, refetch: refetchAppRequests } = useAppDevelopmentRequests(true);
  const { data: iosRequests, loading: iosRequestsLoading, error: iosRequestsError, refetch: refetchIOSRequests } = useIOSDevelopmentRequests(true);
  const { data: webRequests, loading: webRequestsLoading, error: webRequestsError, refetch: refetchWebRequests } = useWebDevelopmentRequests(true);
  
  const { update: updateApp, remove: removeApp } = useFirebaseCRUD(dataService.collections.APP_DEVELOPMENT_REQUESTS);
  const { update: updateIOS, remove: removeIOS } = useFirebaseCRUD(dataService.collections.IOS_DEVELOPMENT_REQUESTS);
  const { update: updateWeb, remove: removeWeb } = useFirebaseCRUD(dataService.collections.WEB_DEVELOPMENT_REQUESTS);
  
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestFilter, setRequestFilter] = useState('all');
  const [activeRequestType, setActiveRequestType] = useState('android'); // android, ios, web
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: '',
    frameworks: [],
    buttonText: 'Learn More',
    buttonAction: ''
  });
  const [frameworkInput, setFrameworkInput] = useState('');

  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  // Save services to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFramework = () => {
    if (frameworkInput.trim() && !formData.frameworks.includes(frameworkInput.trim())) {
      setFormData(prev => ({
        ...prev,
        frameworks: [...prev.frameworks, frameworkInput.trim()]
      }));
      setFrameworkInput('');
    }
  };

  const removeFramework = (framework) => {
    setFormData(prev => ({
      ...prev,
      frameworks: prev.frameworks.filter(f => f !== framework)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      const newService = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        image: formData.imagePreview,
        frameworks: formData.frameworks,
        buttonText: formData.buttonText,
        buttonAction: formData.buttonAction,
        createdAt: new Date().toISOString()
      };

      setServices(prev => [...prev, newService]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        frameworks: [],
        buttonText: 'Learn More',
        buttonAction: ''
      });
      setShowAddForm(false);
    }
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  // Development Request Functions
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      let result;
      if (activeRequestType === 'android') {
        result = await updateApp(requestId, { status: newStatus });
      } else if (activeRequestType === 'ios') {
        result = await updateIOS(requestId, { status: newStatus });
      } else if (activeRequestType === 'web') {
        result = await updateWeb(requestId, { status: newStatus });
      }
      
      if (!result.success) {
        alert('Error updating status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const updateRequestPriority = async (requestId, newPriority) => {
    try {
      let result;
      if (activeRequestType === 'android') {
        result = await updateApp(requestId, { priority: newPriority });
      } else if (activeRequestType === 'ios') {
        result = await updateIOS(requestId, { priority: newPriority });
      } else if (activeRequestType === 'web') {
        result = await updateWeb(requestId, { priority: newPriority });
      }
      
      if (!result.success) {
        alert('Error updating priority. Please try again.');
      }
    } catch (error) {
      console.error('Error updating request priority:', error);
      alert('Error updating priority. Please try again.');
    }
  };

  const deleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      let result;
      if (activeRequestType === 'android') {
        result = await removeApp(requestId);
      } else if (activeRequestType === 'ios') {
        result = await removeIOS(requestId);
      } else if (activeRequestType === 'web') {
        result = await removeWeb(requestId);
      }
      
      if (result.success) {
        setSelectedRequest(null);
      } else {
        alert('Error deleting request. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request. Please try again.');
    }
  };

  // Get current requests based on active type
  const getCurrentRequests = () => {
    if (activeRequestType === 'android') return appRequests;
    if (activeRequestType === 'ios') return iosRequests;
    if (activeRequestType === 'web') return webRequests;
    return [];
  };

  const getCurrentLoading = () => {
    if (activeRequestType === 'android') return appRequestsLoading;
    if (activeRequestType === 'ios') return iosRequestsLoading;
    if (activeRequestType === 'web') return webRequestsLoading;
    return false;
  };

  const getCurrentError = () => {
    if (activeRequestType === 'android') return appRequestsError;
    if (activeRequestType === 'ios') return iosRequestsError;
    if (activeRequestType === 'web') return webRequestsError;
    return null;
  };

  const getCurrentRefetch = () => {
    if (activeRequestType === 'android') return refetchAppRequests;
    if (activeRequestType === 'ios') return refetchIOSRequests;
    if (activeRequestType === 'web') return refetchWebRequests;
    return () => {};
  };

  const filteredRequests = getCurrentRequests().filter(request => {
    if (requestFilter === 'all') return true;
    return request.status === requestFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'on-hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50/20 to-background-light dark:from-background-dark dark:via-primary-900/10 dark:to-background-dark">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <svg className="w-6 h-6 text-white animate-float" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Services Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                  Add and manage your services from the admin panel
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="group px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-xl btn-animated"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Service Management Navigation */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/app-development-requests"
                className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    App Development Requests
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage Android app requests
                  </p>
                </div>
              </Link>

              <Link
                to="/contact-management"
                className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                    Contact Management
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage contact inquiries
                  </p>
                </div>
              </Link>

              <Link
                to="/job-openings"
                className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-200 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Job Management
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage job openings
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Development Requests Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Development Requests</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage client requests for app and web development</p>
                </div>
                <button
                  onClick={getCurrentRefetch()}
                  disabled={getCurrentLoading()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {getCurrentLoading() ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh
                </button>
              </div>
            </div>

            {/* Development Type Tabs */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { key: 'android', label: 'Android Apps', icon: '📱', count: appRequests.length },
                  { key: 'ios', label: 'iOS Apps', icon: '🍎', count: iosRequests.length },
                  { key: 'web', label: 'Web Projects', icon: '🌐', count: webRequests.length }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => {
                      setActiveRequestType(type.key);
                      setRequestFilter('all');
                    }}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      activeRequestType === type.key
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4 overflow-x-auto">
                {['all', 'new', 'in-progress', 'completed', 'on-hold', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setRequestFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                      requestFilter === status
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {status === 'all' ? 'All Requests' : status.replace('-', ' ')}
                    <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                      {status === 'all' ? getCurrentRequests().length : getCurrentRequests().filter(r => r.status === status).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Content */}
            {getCurrentLoading() ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading {activeRequestType} requests...</span>
              </div>
            ) : getCurrentError() ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error loading {activeRequestType} requests</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{getCurrentError()}</p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={getCurrentRefetch()}
                          className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No {activeRequestType} requests found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {requestFilter === 'all' ? `No ${activeRequestType} development requests have been submitted yet.` : `No ${requestFilter.replace('-', ' ')} ${activeRequestType} requests found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.clientName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {request.email}
                            </div>
                            {request.phone && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {request.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                              {request.appName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {request.appDescription}
                            </div>
                            {request.budget && (
                              <div className="text-sm text-green-600 dark:text-green-400">
                                Budget: {request.budget}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={request.status}
                            onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(request.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={request.priority}
                            onChange={(e) => updateRequestPriority(request.id, e.target.value)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getPriorityColor(request.priority)}`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(request.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Add Service Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Service</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter service title"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter service description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {formData.imagePreview && (
                  <div className="mt-4">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Frameworks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frameworks/Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={frameworkInput}
                    onChange={(e) => setFrameworkInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFramework())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Add framework (e.g., React, Node.js)"
                  />
                  <button
                    type="button"
                    onClick={addFramework}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.frameworks.map((framework, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                    >
                      {framework}
                      <button
                        type="button"
                        onClick={() => removeFramework(framework)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter button text"
                />
              </div>

              {/* Button Action/Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Action (URL or Action)
                </label>
                <input
                  type="text"
                  name="buttonAction"
                  value={formData.buttonAction}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter URL or action"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Enhanced Services Display */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {services.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center animate-float">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Services Added Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start building your service catalog by adding your first service using the "Add New Service" button above.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {service.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                        title="Delete Service"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {service.frameworks.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.frameworks.map((framework, frameworkIndex) => (
                            <span
                              key={frameworkIndex}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-300"
                            >
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {service.buttonText && (
                      <button
                        onClick={() => {
                          if (service.buttonAction) {
                            if (service.buttonAction.startsWith('http')) {
                              window.open(service.buttonAction, '_blank');
                            } else {
                              console.log('Action:', service.buttonAction);
                            }
                          }
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg btn-animated"
                      >
                        {service.buttonText}
                      </button>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Added: {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    App Development Request Details
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Client Information</h4>
                      <p><strong>Name:</strong> {selectedRequest.clientName}</p>
                      <p><strong>Email:</strong> {selectedRequest.email}</p>
                      {selectedRequest.phone && <p><strong>Phone:</strong> {selectedRequest.phone}</p>}
                      {selectedRequest.company && <p><strong>Company:</strong> {selectedRequest.company}</p>}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Request Details</h4>
                      <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span></p>
                      <p><strong>Priority:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority}</span></p>
                      <p><strong>Submitted:</strong> {formatDate(selectedRequest.submittedAt)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">App Information</h4>
                    <p><strong>App Name:</strong> {selectedRequest.appName}</p>
                    <p><strong>Description:</strong> {selectedRequest.appDescription}</p>
                    {selectedRequest.features && (
                      <div>
                        <strong>Features:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {selectedRequest.features.split('\n').map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedRequest.budget && <p><strong>Budget:</strong> {selectedRequest.budget}</p>}
                    {selectedRequest.timeline && <p><strong>Timeline:</strong> {selectedRequest.timeline}</p>}
                  </div>
                  
                  {selectedRequest.additionalNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Additional Notes</h4>
                      <p className="whitespace-pre-wrap">{selectedRequest.additionalNotes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
