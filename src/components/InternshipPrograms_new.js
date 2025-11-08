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
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'interviewed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Internship Programs</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage internship applications from client website
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refetchApplications}
              disabled={applicationsLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Test Fetch
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { title: 'Total Applications', count: statusCounts.all, color: 'blue' },
          { title: 'Pending', count: statusCounts.pending, color: 'yellow' },
          { title: 'Reviewing', count: statusCounts.reviewing, color: 'blue' },
          { title: 'Accepted', count: statusCounts.accepted, color: 'green' },
          { title: 'Rejected', count: statusCounts.rejected, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className={`text-2xl font-bold ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'red' ? 'text-red-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {stat.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applicationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
          </div>
        ) : applicationsError ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
              <p className="mt-2 text-sm text-red-700">{applicationsError}</p>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filterStatus === 'all' ? 'No Internship Applications' : `No ${filterStatus} Applications`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterStatus === 'all' 
                ? 'Internship applications from your client website will appear here.'
                : `No applications with ${filterStatus} status found.`
              }
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.applicantName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Applied {formatDate(application.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={application.status || 'pending'}
                    onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(application.status || 'pending')}`}
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
                  <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {application.email}
                    </span>
                  </p>
                  {application.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <h4 className="font-medium text-gray-900 dark:text-white">Internship Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                      </svg>
                      {application.domain}
                    </span>
                  </p>
                  {application.duration && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {application.duration}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Documents</h4>
                  {application.resumeFileName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Application ID: {application.id.substring(0, 8)}...
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteApplication(application.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Internship Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
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
                    <h4 className="font-semibold text-gray-900 dark:text-white">Applicant Information</h4>
                    <p><strong>Name:</strong> {selectedApplication.applicantName}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    {selectedApplication.phone && <p><strong>Phone:</strong> {selectedApplication.phone}</p>}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Internship Details</h4>
                    <p><strong>Domain:</strong> {selectedApplication.domain}</p>
                    <p><strong>Type:</strong> {selectedApplication.applicationType === 'internship' ? 'Internship Application' : 'Application'}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedApplication.status)}`}>{selectedApplication.status}</span></p>
                    <p><strong>Applied:</strong> {formatDate(selectedApplication.submittedAt)}</p>
                  </div>
                </div>
                
                {selectedApplication.duration && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Duration</h4>
                    <p>{selectedApplication.duration}</p>
                  </div>
                )}
                
                {selectedApplication.resumeFileName && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Resume</h4>
                    <p>{selectedApplication.resumeFileName}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteApplication(selectedApplication.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipPrograms;
