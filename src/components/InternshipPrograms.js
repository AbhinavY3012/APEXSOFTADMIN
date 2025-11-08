import React, { useState } from 'react';
import { useInternshipApplications, useFirebaseCRUD } from '../hooks/useFirebaseData';
import dataService from '../services/dataService';
import { formatDate } from '../utils/dateUtils';

const InternshipPrograms = () => {
  // Firebase hooks for internship applications
  const { data: internshipApplications, loading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useInternshipApplications(true);
  const { update: updateApplication, remove: removeApplication } = useFirebaseCRUD(dataService.collections.INTERNSHIP_APPLICATIONS);
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Debug logging
  console.log('InternshipPrograms Debug:', {
    internshipApplications,
    applicationsLoading,
    applicationsError,
    applicationsLength: internshipApplications?.length || 0
  });

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const result = await updateApplication(applicationId, { status: newStatus });
      if (!result.success) {
        alert('Error updating application status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status. Please try again.');
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const result = await removeApplication(applicationId);
      if (result.success) {
        setSelectedApplication(null);
      } else {
        alert('Error deleting application. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'reviewing': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'interviewed': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'accepted': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getFilteredApplications = () => {
    if (filterStatus === 'all') {
      return internshipApplications;
    }
    return internshipApplications.filter(app => (app.status || 'pending') === filterStatus);
  };

  const getStatusCounts = () => {
    const counts = {
      all: internshipApplications.length,
      pending: 0,
      reviewing: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0
    };

    internshipApplications.forEach(app => {
      const status = app.status || 'pending';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const filteredApplications = getFilteredApplications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Internship Programs
              </h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base lg:text-lg">
                Manage internship applications from client website
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-end">
              <button
                onClick={refetchApplications}
                disabled={applicationsLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {applicationsLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
              <button
                onClick={async () => {
                  console.log('Manual test: Fetching internship applications...');
                  const result = await dataService.getInternshipApplications();
                  console.log('Manual test result:', result);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                Test Fetch
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Applications</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{statusCounts.all}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mt-2 sm:mt-0 self-end sm:self-auto">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Reviewing</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{statusCounts.reviewing}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Accepted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.accepted}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

        {/* Filter Tabs */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
          {[
            { key: 'all', label: 'All Applications', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'reviewing', label: 'Reviewing', count: statusCounts.reviewing },
            { key: 'interviewed', label: 'Interviewed', count: statusCounts.interviewed },
            { key: 'accepted', label: 'Accepted', count: statusCounts.accepted },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected }
          ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filterStatus === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 shadow-md hover:shadow-lg border border-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.key === 'all' ? 'All' : tab.key}</span>
                <span className="ml-1">({tab.count})</span>
              </button>
          ))}
        </div>
      </div>

        {/* Applications List */}
        <div className="space-y-3 sm:space-y-4">
        {applicationsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <span className="text-lg font-medium text-gray-600">Loading applications...</span>
            </div>
          </div>
        ) : applicationsError ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error loading applications</h3>
              <p className="text-red-700">{applicationsError}</p>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {filterStatus === 'all' ? 'No Internship Applications' : `No ${filterStatus} Applications`}
              </h3>
              <p className="text-gray-600 text-lg">
                {filterStatus === 'all' 
                  ? 'Internship applications from your client website will appear here.'
                  : `No applications with ${filterStatus} status found.`
                }
              </p>
            </div>
          </div>
        ) : (
          filteredApplications.map((application, index) => (
            <div key={application.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{application.applicantName}</h3>
                        <p className="text-sm text-gray-500 font-medium">Applied {formatDate(application.submittedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={application.status || 'pending'}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-300 hover:scale-105 ${getStatusColor(application.status || 'pending')}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Contact Information</h4>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {application.email}
                          </span>
                        </p>
                        {application.phone && (
                          <p className="text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {application.phone}
                            </span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Internship Details</h4>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0h-2" />
                            </svg>
                            {application.domain}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {application.duration}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {application.applicationType === 'internship' ? 'Internship Application' : 'Application'}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Documents</h4>
                        {application.resumeFileName && (
                          <p className="text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {application.resumeFileName}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <div className="text-xs text-gray-500 font-medium">
                        ID: {application.id.substring(0, 8)}...
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => deleteApplication(application.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Internship Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span className={`px-6 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedApplication.status || 'pending')}`}>
                  {(selectedApplication.status || 'pending').toUpperCase()}
                </span>
              </div>

              {/* Main Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applicant Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Applicant Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-20">Name:</span>
                      <span className="text-gray-800 font-medium">{selectedApplication.applicantName || 'N/A'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-20">Email:</span>
                      <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:text-blue-800 font-medium break-all">
                        {selectedApplication.email || 'N/A'}
                      </a>
                    </div>
                    {selectedApplication.phone && (
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-600 w-20">Phone:</span>
                        <a href={`tel:${selectedApplication.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {selectedApplication.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Internship Details */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                    </svg>
                    Internship Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-20">Domain:</span>
                      <span className="text-gray-800 font-medium">{selectedApplication.domain || 'N/A'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-20">Type:</span>
                      <span className="text-gray-800 font-medium">
                        {selectedApplication.applicationType === 'internship' ? 'Internship Application' : selectedApplication.applicationType || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-20">Applied:</span>
                      <span className="text-gray-800 font-medium">{formatDate(selectedApplication.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Duration Section */}
              {selectedApplication.duration && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration
                  </h4>
                  <p className="text-gray-800 font-medium text-lg">{selectedApplication.duration}</p>
                </div>
              )}
              
              {/* Resume Section */}
              {selectedApplication.resumeFileName && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resume
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-medium">{selectedApplication.resumeFileName}</p>
                    {selectedApplication.resumeUrl && (
                      <a 
                        href={selectedApplication.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(selectedApplication.coverLetter || selectedApplication.experience || selectedApplication.skills) && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Additional Information
                  </h4>
                  <div className="space-y-4">
                    {selectedApplication.coverLetter && (
                      <div>
                        <span className="font-semibold text-gray-700 block mb-2">Cover Letter:</span>
                        <p className="text-gray-600 bg-white p-3 rounded-lg border">{selectedApplication.coverLetter}</p>
                      </div>
                    )}
                    {selectedApplication.experience && (
                      <div>
                        <span className="font-semibold text-gray-700 block mb-2">Experience:</span>
                        <p className="text-gray-600 bg-white p-3 rounded-lg border">{selectedApplication.experience}</p>
                      </div>
                    )}
                    {selectedApplication.skills && (
                      <div>
                        <span className="font-semibold text-gray-700 block mb-2">Skills:</span>
                        <p className="text-gray-600 bg-white p-3 rounded-lg border">{selectedApplication.skills}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application Metadata */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Application ID:</span> {selectedApplication.id}
                  </div>
                  <div>
                    <span className="font-semibold">Submitted:</span> {formatDate(selectedApplication.submittedAt)} at {selectedApplication.submittedAt ? new Date(selectedApplication.submittedAt).toLocaleTimeString() : 'N/A'}
                  </div>
                  {selectedApplication.updatedAt && (
                    <div className="md:col-span-2">
                      <span className="font-semibold">Last Updated:</span> {formatDate(selectedApplication.updatedAt)} at {new Date(selectedApplication.updatedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-700">Update Status:</label>
                  <select
                    value={selectedApplication.status || 'pending'}
                    onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-300 ${getStatusColor(selectedApplication.status || 'pending')}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
                        deleteApplication(selectedApplication.id);
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Delete Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InternshipPrograms;
