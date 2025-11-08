import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Load contact submissions from localStorage on component mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('contactSubmissions');
    if (savedSubmissions) {
      setContactSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save contact submissions to localStorage whenever submissions change
  useEffect(() => {
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
  }, [contactSubmissions]);

  const updateSubmissionStatus = (submissionId, newStatus) => {
    setContactSubmissions(prev => prev.map(submission => 
      submission.id === submissionId ? { ...submission, status: newStatus } : submission
    ));
  };

  const deleteSubmission = (submissionId) => {
    setContactSubmissions(prev => prev.filter(submission => submission.id !== submissionId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
    }
  };

  const getFilteredSubmissions = () => {
    if (filterStatus === 'all') {
      return contactSubmissions;
    }
    return contactSubmissions.filter(submission => (submission.status || 'pending') === filterStatus);
  };

  const getStatusCounts = () => {
    const counts = {
      all: contactSubmissions.length,
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0
    };

    contactSubmissions.forEach(submission => {
      const status = submission.status || 'pending';
      counts[status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const filteredSubmissions = getFilteredSubmissions();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Submissions</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage contact form submissions from your website
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Submissions', count: statusCounts.all, color: 'blue', icon: '📧' },
          { title: 'Pending', count: statusCounts.pending, color: 'yellow', icon: '⏳' },
          { title: 'In Progress', count: statusCounts['in-progress'], color: 'blue', icon: '🔄' },
          { title: 'Resolved', count: statusCounts.resolved, color: 'green', icon: '✅' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className={`text-2xl font-bold ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                  stat.color === 'green' ? 'text-green-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {stat.count}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Submissions', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
            { key: 'resolved', label: 'Resolved', count: statusCounts.resolved },
            { key: 'closed', label: 'Closed', count: statusCounts.closed }
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

      {/* Contact Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filterStatus === 'all' ? 'No Contact Submissions' : `No ${filterStatus} Submissions`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterStatus === 'all' 
                ? 'Contact form submissions from your website will appear here.'
                : `No submissions with ${filterStatus} status found.`
              }
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{submission.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status || 'pending')}`}>
                        {submission.status || 'pending'}
                      </span>
                      {submission.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(submission.priority)}`}>
                          {submission.priority} priority
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Email:</strong> {submission.email}
                        </p>
                        {submission.phone && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Phone:</strong> {submission.phone}
                          </p>
                        )}
                        {submission.company && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Company:</strong> {submission.company}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Subject:</strong> {submission.subject}
                        </p>
                        {submission.service && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Service:</strong> {submission.service}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {submission.message && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          {submission.message}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={submission.status || 'pending'}
                          onChange={(e) => updateSubmissionStatus(submission.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-3 py-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        
                        <button
                          onClick={() => setSelectedSubmission(selectedSubmission === submission.id ? null : submission.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors dark:bg-blue-900/50 dark:text-blue-200"
                        >
                          {selectedSubmission === submission.id ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        <button
                          onClick={() => deleteSubmission(submission.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors dark:bg-red-900/50 dark:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSubmission === submission.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Full Submission Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Contact Information</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Full Name:</strong> {submission.name}</p>
                          <p><strong>Email:</strong> {submission.email}</p>
                          {submission.phone && <p><strong>Phone:</strong> {submission.phone}</p>}
                          {submission.company && <p><strong>Company:</strong> {submission.company}</p>}
                          {submission.website && <p><strong>Website:</strong> {submission.website}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Submission Details</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Subject:</strong> {submission.subject}</p>
                          {submission.service && <p><strong>Service Interest:</strong> {submission.service}</p>}
                          {submission.budget && <p><strong>Budget:</strong> {submission.budget}</p>}
                          {submission.timeline && <p><strong>Timeline:</strong> {submission.timeline}</p>}
                          <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {submission.attachments && submission.attachments.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h5>
                        <div className="space-y-2">
                          {submission.attachments.map((attachment, index) => (
                            <a 
                              key={index}
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900/50 dark:text-blue-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Contact;
