import React, { useState } from 'react';
import { useContacts, useFirebaseCRUD } from '../hooks/useFirebaseData';
import dataService from '../services/dataService';
import { formatDate } from '../utils/dateUtils';
import { db } from '../firebase';

const ContactManagement = () => {
  const { data: contacts, loading, error, refetch } = useContacts(true); // Use real-time data
  const { update, remove } = useFirebaseCRUD(dataService.collections.CONTACTS);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);


  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const result = await update(contactId, { status: newStatus });
      if (!result.success) {
        alert('Error updating status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const result = await remove(contactId);
      if (result.success) {
        setSelectedContact(null);
      } else {
        alert('Error deleting contact. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact. Please try again.');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
      case 'in-progress': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      case 'resolved': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading contacts</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={refetch}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-800 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="z-10">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Contact Management
          </h1>
          <p className="text-gray-500 font-medium">
            Manage inquiries and messages from your website
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={refetch}
              disabled={loading}
              className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all shadow-sm font-semibold flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
            
            {/* Dev Tools - Simplified for cleaner UI */}
            <div className="flex bg-gray-100/50 rounded-xl p-1 border border-gray-200">
                <button onClick={() => { console.log('Current contacts:', contacts); alert(`Contacts: ${contacts.length}`); }} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="Debug Info">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </button>
                <button onClick={() => dataService.createContact({ name: 'Test', email: 'test@example.com', subject: 'Test', message: 'Test msg', source: 'admin' }).then(r => r.success && refetch())} className="p-2 text-gray-500 hover:text-green-600 hover:bg-white rounded-lg transition-all" title="Add Test Contact">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        {/* Total Contacts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Messages</p>
            <h3 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{contacts.length}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
        </div>

        {/* New */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">New</p>
            <h3 className="text-3xl font-bold text-blue-600">{contacts.filter(c => c.status === 'new').length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">In Progress</p>
            <h3 className="text-3xl font-bold text-amber-500">{contacts.filter(c => c.status === 'in-progress').length}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Resolved</p>
            <h3 className="text-3xl font-bold text-green-500">{contacts.filter(c => c.status === 'resolved').length}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
          {/* Tabs */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-2">
             {['all', 'new', 'in-progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    filter === status
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Messages' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
             ))}
          </div>

          {/* Table */}
          {filteredContacts.length === 0 ? (
            <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-gray-900 font-medium text-lg mb-1">No messages found</h3>
                <p className="text-gray-400">Adjust filters or wait for new inquiries</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{contact.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-medium truncate max-w-xs">{contact.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                         {formatDate(contact.submittedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setSelectedContact(contact)}
                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                title="View Details"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            
                            <div className="relative group/status">
                                <select
                                    value={contact.status}
                                    onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs rounded-lg py-2 pl-3 pr-8 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                >
                                    <option value="new">New</option>
                                    <option value="in-progress">Pending</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteContact(contact.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-all">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                   <p className="text-sm text-gray-500 mt-1">Reviewing submission from {formatDate(selectedContact.submittedAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                        <p className="text-gray-900 font-semibold">{selectedContact.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                        <p className="text-gray-900 font-semibold">{selectedContact.email}</p>
                    </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl text-gray-800 font-medium shadow-sm">
                      {selectedContact.subject}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
                  <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedContact.message}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-6">
                  <span className="text-sm font-medium text-gray-500">Current Status:</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                 <button
                  onClick={() => setSelectedContact(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedContact.status !== 'resolved' && (
                    <button
                      onClick={() => {
                          updateContactStatus(selectedContact.id, 'resolved');
                          setSelectedContact({...selectedContact, status: 'resolved'});
                      }}
                      className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                    >
                      Mark as Resolved
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
