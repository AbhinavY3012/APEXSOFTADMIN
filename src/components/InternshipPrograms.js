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
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interviewed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-800 animate-fade-in relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply animate-pulse-slow"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply animate-pulse-slow animation-delay-2000"></div>

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 transition-all hover:shadow-md">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2 tracking-tight">
            Internship Programs
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            Manage and review internship applications with ease
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={refetchApplications}
              disabled={applicationsLoading}
              className="px-5 py-2.5 bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all shadow-sm font-semibold flex items-center gap-2 group"
            >
              <div className={`transition-transform duration-700 ${applicationsLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                {applicationsLoading ? (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                )}
              </div>
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button
                onClick={async () => {
                  const result = await dataService.getInternshipApplications();
                  console.log(result);
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               <span>Test Fetch</span>
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
         {/* Total */}
         <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               </div>
               <span className="text-2xl font-bold text-gray-800">{statusCounts.all}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applications</p>
         </div>

         {/* Pending */}
         <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <span className="text-2xl font-bold text-gray-800">{statusCounts.pending}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
         </div>

         {/* Reviewing */}
         <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <span className="text-2xl font-bold text-gray-800">{statusCounts.reviewing}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reviewing</p>
         </div>

         {/* Accepted */}
         <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <span className="text-2xl font-bold text-gray-800">{statusCounts.accepted}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accepted</p>
         </div>

         {/* Rejected */}
         <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
               <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </div>
               <span className="text-2xl font-bold text-gray-800">{statusCounts.rejected}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rejected</p>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm w-full md:w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'reviewing', label: 'Reviewing' },
          { key: 'interviewed', label: 'Interviewed' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'rejected', label: 'Rejected' }
        ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filterStatus === tab.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 cursor-default'
                  : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600'
              }`}
            >
              <span className="capitalize">{tab.label}</span>
              {tab.key !== 'all' && (
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${
                    filterStatus === tab.key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                }`}>
                    {statusCounts[tab.key]}
                </span>
              )}
            </button>
        ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-4">
        {applicationsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        ) : applicationsError ? (
            <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                <p className="text-red-600 font-medium mb-2">Error loading applications</p>
                <p className="text-red-500 text-sm">{applicationsError}</p>
                <button onClick={refetchApplications} className="mt-4 text-sm text-red-700 underline">Try Again</button>
            </div>
        ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-400">No applications found</h3>
                <p className="text-gray-400 text-sm mt-1">Try changing the filter or refresh</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredApplications.map((app, idx) => (
                    <div 
                        key={app.id} 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{app.applicantName || 'Unknown Applicant'}</h3>
                                    <p className="text-xs text-gray-500">{formatDate(app.submittedAt)}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(app.status || 'pending')}`}>
                                {app.status || 'pending'}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span className="truncate">{app.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0h-2" /></svg>
                                <span className="font-medium">{app.domain || 'General Internship'}</span>
                            </div>
                            {app.resumeFileName && (
                                <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                    <span className="truncate flex-1">{app.resumeFileName}</span>
                                </div>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => setSelectedApplication(app)}
                                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                View Details
                            </button>
                            <div className="relative group/actions">
                                <button className="p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                </button>
                                {/* Quick Actions Dropdown (CSS Hover only for demo simplicity, logic would need state) */}
                                <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover/actions:block z-10">
                                    <button onClick={() => updateApplicationStatus(app.id, 'reviewing')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700">Mark Reviewing</button>
                                    <button onClick={() => deleteApplication(app.id)} className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scale-in">
              {/* Sidebar Info (Desktop) / Top Info (Mobile) */}
              <div className="w-full md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col">
                 <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                        {selectedApplication.applicantName ? selectedApplication.applicantName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedApplication.applicantName}</h2>
                    <p className="text-indigo-600 font-medium text-sm mt-1">{selectedApplication.domain}</p>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</label>
                        <div className="mt-1 space-y-2">
                            <a href={`mailto:${selectedApplication.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span className="truncate">{selectedApplication.email}</span>
                            </a>
                            {selectedApplication.phone && (
                                <a href={`tel:${selectedApplication.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span>{selectedApplication.phone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {selectedApplication.resumeUrl && (
                        <div>
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attachments</label>
                           <a 
                             href={selectedApplication.resumeUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="mt-2 block p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                 </div>
                                 <div className="overflow-hidden">
                                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">Resume_File.pdf</p>
                                    <p className="text-xs text-gray-400">Click to view</p>
                                 </div>
                              </div>
                           </a>
                        </div>
                    )}
                 </div>
                 
                 <div className="text-xs text-gray-400 mt-6 pt-6 border-t border-gray-200">
                    Applied on {formatDate(selectedApplication.submittedAt)}
                 </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-white p-6 md:p-8 overflow-y-auto flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Application Details</h3>
                    <button onClick={() => setSelectedApplication(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>

                 <div className="space-y-6 flex-1">
                    {/* Status Select */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Status</label>
                        <select
                            value={selectedApplication.status || 'pending'}
                            onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-gray-50 transition-all font-medium text-gray-700"
                        >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Under Review</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {selectedApplication.coverLetter ? (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter</label>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedApplication.coverLetter}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm italic">No cover letter provided</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <label className="text-xs font-bold text-blue-800 uppercase tracking-wide">Experience</label>
                            <p className="mt-1 font-semibold text-gray-800">{selectedApplication.experience || 'Not specified'}</p>
                        </div>
                        <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                            <label className="text-xs font-bold text-purple-800 uppercase tracking-wide">Duration</label>
                            <p className="mt-1 font-semibold text-gray-800">{selectedApplication.duration || 'Not specified'}</p>
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                        onClick={() => {
                            if (window.confirm('Delete this application?')) {
                                deleteApplication(selectedApplication.id);
                            }
                        }}
                        className="px-5 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => setSelectedApplication(null)}
                        className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                    >
                        Done
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
