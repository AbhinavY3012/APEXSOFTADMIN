import React, { useState, useEffect } from 'react';
import { useJobApplications, useFirebaseCRUD } from '../hooks/useFirebaseData';
import dataService from '../services/dataService';
import { formatDate } from '../utils/dateUtils';

const JobOpenings = () => {
  // Firebase hooks for job applications
  const { data: applications, loading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useJobApplications(null, true);
  const { update: updateApplication, remove: removeApplication } = useFirebaseCRUD(dataService.collections.JOB_APPLICATIONS);
  
  // Debug logging
  console.log('JobOpenings Debug:', {
    applications,
    applicationsLoading,
    applicationsError,
    applicationsLength: applications?.length || 0
  });
  
  const [jobs, setJobs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('applications'); // Start with applications tab
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: [],
    responsibilities: [],
    skills: []
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Application management functions
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

  const filteredApplications = applications.filter(application => {
    if (applicationFilter === 'all') return true;
    return application.status === applicationFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim() && !formData.responsibilities.includes(newResponsibility.trim())) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (responsibility) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(r => r !== responsibility)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      const newJob = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setJobs(prev => [...prev, newJob]);
      
      // Reset form
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: [],
        responsibilities: [],
        skills: []
      });
      setShowAddForm(false);
    }
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const toggleJobStatus = (id) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, isActive: !job.isActive } : job
    ));
  };

  // Helper functions for applications
  const getJobApplications = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      pending: 0,
      reviewing: 0,
      interviewed: 0,
      hired: 0,
      rejected: 0
    };

    applications.forEach(app => {
      const status = app.status || 'pending';
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  };

  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-8 animate-fade-in p-6 lg:p-10 min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">Job Openings Management</h1>
          <p className="mt-2 text-gray-500 font-medium">
            Create and manage job postings and track applications efficiently
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-glow px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Job
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
        {/* Modern Tab Navigation */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
          <div className="flex space-x-2 bg-gray-100/80 p-1.5 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'applications'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Job Applications
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'applications' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {applications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('openings')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'openings'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Job Openings
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'openings' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {jobs.length}
              </span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'applications' ? (
            <div className="animate-fade-in-up">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {(() => {
                  const stats = getApplicationStats();
                  const statItems = [
                    { title: 'Total', count: stats.total, color: 'indigo', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Pending', count: stats.pending, color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Reviewing', count: stats.reviewing, color: 'blue', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                    { title: 'Interview', count: stats.interviewed, color: 'purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { title: 'Hired', count: stats.hired, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Rejected', count: stats.rejected, color: 'red', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ];

                  return statItems.map((stat, index) => (
                    <div key={index} className="card-professional p-4 rounded-2xl bg-white hover:bg-gray-50/50 transition-all border border-gray-100 group">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-100 transition-colors`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                          </svg>
                        </div>
                        <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
                    </div>
                  ));
                })()}
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Filter Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['all', 'pending', 'reviewing', 'interviewed', 'hired', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setApplicationFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap ${
                        applicationFilter === status
                          ? 'bg-gray-900 text-white shadow-lg ring-2 ring-gray-900 ring-offset-2 transform scale-105'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={refetchApplications}
                    disabled={applicationsLoading}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Refresh List"
                  >
                    <svg className={`w-5 h-5 ${applicationsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {applicationsLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-full w-48"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded w-24"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded w-24"></div></td>
                          <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-20"></div></td>
                        </tr>
                      ))
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">No applications found</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters or wait for new applications.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                                {application.applicantName?.charAt(0) || 'A'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{application.applicantName}</div>
                                <div className="text-sm text-gray-500">{application.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-semibold">{application.domain}</div>
                            <div className="text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mt-1 font-medium border border-blue-100">
                              {application.applicationType === 'job' ? 'Full-time' : 'Internship'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={application.status}
                              onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all hover:shadow-sm ${getStatusColor(application.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {formatDate(application.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setSelectedApplication(application)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                              >
                                View
                              </button>
                              <button
                                onClick={() => deleteApplication(application.id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              {/* Job Openings List */}
              {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="bg-blue-50 p-6 rounded-full inline-block mb-4 shadow-sm">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No Job Openings Yet</h3>
                  <p className="mt-2 text-gray-500 mb-8 max-w-sm mx-auto">Get started by creating your first job posting to attract top talent.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-500/20 font-semibold"
                  >
                    Create Job Opening
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map((job) => (
                    <div key={job.id} className="card-professional bg-white rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-100 group relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                              job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {job.isActive ? 'Active' : 'Closed'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => toggleJobStatus(job.id)}
                            className={`flex-1 md:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ${
                              job.isActive
                                ? 'bg-white border border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                                : 'bg-white border border-green-200 text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {job.isActive ? 'Close Job' : 'Reopen Job'}
                          </button>
                          <button
                            onClick={() => deleteJob(job.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Job"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="col-span-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{job.description}</p>
                            
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100">
                                        {skill}
                                    </span>
                                ))}
                                {job.skills.length === 0 && <span className="text-gray-400 text-xs italic">No specific skills listed</span>}
                            </div>
                         </div>
                         <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Performance
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg shadow-sm">
                                    <span className="text-gray-500">Applications</span>
                                    <span className="font-bold text-gray-900 bg-blue-50 px-2 py-0.5 rounded-md text-blue-700">{getJobApplications(job.id).length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg shadow-sm">
                                    <span className="text-gray-500">Posted</span>
                                    <span className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                             <div className="mt-4 pt-3 border-t border-gray-200">
                                <button 
                                    onClick={() => setActiveTab('applications')}
                                    className="w-full text-center text-blue-600 text-sm font-bold hover:text-blue-700 hover:underline transition-all flex items-center justify-center gap-1"
                                >
                                    View All Applications
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                             </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Add Job Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up border border-gray-100">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    Create New Opportunity
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-4">Fill in the details for the new job posting</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                       <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                      Basic Information
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 dashed-underline w-fit">Job Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
                        placeholder="e.g., Engineering"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Type <span className="text-red-500">*</span></label>
                          <div className="relative">
                              <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white appearance-none"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                          </div>
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1.5">Experience <span className="text-red-500">*</span></label>
                           <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="e.g., 3-5 years"
                          />
                        </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
                        placeholder="e.g., Remote / New York, USA"
                      />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Role Details
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none bg-gray-50 focus:bg-white"
                          placeholder="Describe the role, team, and main objectives..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            placeholder="Add a skill (e.g. React)"
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-md"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                          {formData.skills.length === 0 && <span className="text-gray-400 text-sm self-center">No skills added yet</span>}
                          {formData.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-full text-sm shadow-sm font-medium animate-fade-in">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                    </div>
                </div>
              </div>

              {/* Lists Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Key Requirements</label>
                    <div className="flex gap-2 mb-3">
                        <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="Add requirement"
                        />
                        <button
                        type="button"
                        onClick={addRequirement}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                        >
                        Add
                        </button>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all animate-fade-in">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span className="flex-1 leading-relaxed">{req}</span>
                            <button
                            type="button"
                            onClick={() => removeRequirement(req)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                        </li>
                        ))}
                        {formData.requirements.length === 0 && <li className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">No requirements listed</li>}
                    </ul>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities</label>
                     <div className="flex gap-2 mb-3">
                        <input
                        type="text"
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="Add responsibility"
                        />
                         <button
                        type="button"
                        onClick={addResponsibility}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                        >
                        Add
                        </button>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.responsibilities.map((res, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all animate-fade-in">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                            <span className="flex-1 leading-relaxed">{res}</span>
                            <button
                            type="button"
                            onClick={() => removeResponsibility(res)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                        </li>
                        ))}
                         {formData.responsibilities.length === 0 && <li className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">No responsibilities listed</li>}
                    </ul>
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-8 -my-8 p-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Create Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;
