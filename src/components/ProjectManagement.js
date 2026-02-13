import React, { useState, useEffect } from 'react';
import { saveProject, getProjects, deleteProject, updateProject } from '../services/projectService';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Secret Edit Mode
  const [tapCount, setTapCount] = useState(0);
  const [isPaymentEditable, setIsPaymentEditable] = useState(false);
  
  // Secret History Edit Mode
  const [historyTapCount, setHistoryTapCount] = useState(0);
  const [isHistoryEditable, setIsHistoryEditable] = useState(false);
  
  // Payment Form State
  const [paymentData, setPaymentData] = useState({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      mode: 'UPI'
  });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    deadline: '',
    budget: '',
    paidAmount: '',
    pendingAmount: '',
    progress: 0,
    description: '',
    teamLead: '',
    paymentHistory: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate pending amount when budget changes
      if (name === 'budget') {
          const budget = parseFloat(value) || 0;
          const paid = parseFloat(prev.paidAmount) || 0;
          updated.pendingAmount = budget - paid;
      }
      
      // Auto-calculate pending when paidAmount is manually edited
      if (name === 'paidAmount') {
          const budget = parseFloat(prev.budget) || 0;
          const paid = parseFloat(value) || 0;
          updated.pendingAmount = budget - paid;
      }

      return updated;
    });
  };

  const handleSecretTap = () => {
      setTapCount(prev => {
          const newCount = prev + 1;
          if (newCount === 5) {
              setIsPaymentEditable(true);
              alert("Secret Mode: Total Paid fields are now editable!");
              return 0;
          }
          return newCount;
      });
  };

  const handleHistorySecretTap = () => {
      setHistoryTapCount(prev => {
          const newCount = prev + 1;
          if (newCount === 5) {
              setIsHistoryEditable(true);
              alert("Secret Mode: Payment History rows are now editable!");
              return 0;
          }
          return newCount;
      });
  };

  const handleHistoryAmountChange = (id, newAmount) => {
      const amount = parseFloat(newAmount) || 0;
      
      setFormData(prev => {
          const newHistory = prev.paymentHistory.map(item => 
              item.id === id ? { ...item, amount: amount } : item
          );
          
          const updatedPaidAmount = newHistory.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
          const updatedPending = (parseFloat(prev.budget) || 0) - updatedPaidAmount;
          
          return {
              ...prev,
              paymentHistory: newHistory,
              paidAmount: updatedPaidAmount,
              pendingAmount: updatedPending
          };
      });
  };

  const handlePaymentInputChange = (e) => {
      const { name, value } = e.target;
      setPaymentData(prev => ({
          ...prev,
          [name]: value
      }));
  };

  const openPaymentModal = () => {
      setPaymentData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          mode: 'UPI'
      });
      setIsPaymentModalOpen(true);
  };

  const submitPayment = (e) => {
      e.preventDefault();
      if(!paymentData.amount) return;
      
      const newPayment = {
          id: Date.now(),
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          mode: paymentData.mode
      };

      const newHistory = [...(formData.paymentHistory || []), newPayment];
      const updatedPaidAmount = newHistory.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const updatedPending = (parseFloat(formData.budget) || 0) - updatedPaidAmount;

      setFormData(prev => ({
          ...prev,
          paidAmount: updatedPaidAmount,
          pendingAmount: updatedPending,
          paymentHistory: newHistory
      }));

      setIsPaymentModalOpen(false);
  };

  const openModal = (project = null) => {
        if (project) {
      setCurrentProject(project);
      const history = project.paymentHistory || [];
      // Calculate paid amount from history if available, else use legacy paidAmount
      const calculatedPaid = history.length > 0 
        ? history.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        : (parseFloat(project.paidAmount) || 0);

      const calculatedPending = (parseFloat(project.budget) || 0) - calculatedPaid;

      setFormData({
        name: project.name || '',
        client: project.client || '',
        status: project.status || 'Planning',
        priority: project.priority || 'Medium',
        startDate: project.startDate || '',
        deadline: project.deadline || '',
        budget: project.budget || '',
        paidAmount: calculatedPaid,
        pendingAmount: calculatedPending,
        progress: project.progress || 0,
        description: project.description || '',
        teamLead: project.teamLead || '',
        paymentHistory: history
      });

    } else {
      setCurrentProject(null);
      setFormData({
        name: '',
        client: '',
        status: 'Planning',
        priority: 'Medium',
        startDate: '',
        deadline: '',
        budget: '',
        paidAmount: '',
        pendingAmount: '',
        progress: 0,
        description: '',
        teamLead: '',
        paymentHistory: []
      });
    }
    // Reset secret mode on open
    setTapCount(0);
    setIsPaymentEditable(false);
    setHistoryTapCount(0);
    setIsHistoryEditable(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProject) {
        await updateProject(currentProject.id, formData);
      } else {
        await saveProject(formData);
      }
      closeModal();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project", error);
      }
    }
  };

  const filteredProjects = filterStatus === 'All' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planning': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'On Hold': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  // Helper to calculate pending amount safely
  // Updated to use the stored pendingAmount if available, or fallback to calc
  // Helper to get pending amount safely
  const getPendingAmount = (project) => {
      if (project.pendingAmount !== undefined && project.pendingAmount !== '') {
          return parseFloat(project.pendingAmount);
      }
      return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Project Management
            </h1>
            <p className="text-gray-500 mt-1">Track, manage and deliver projects efficiently</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Project
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {['All', 'Planning', 'In Progress', 'Completed', 'On Hold'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterStatus === status 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="text-gray-500 mt-1">Get started by creating a new project.</p>
          </div>
        ) : (
          <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredProjects.map((project) => {
                const pendingAmount = getPendingAmount(project);
                return (
                  <div 
                    key={project.id} 
                    className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group ${view === 'list' ? 'flex flex-col md:flex-row md:items-center p-4 gap-4' : 'flex flex-col'}`}
                  >
                    {/* Card Header / List Left */}
                    <div className={`p-6 ${view === 'list' ? 'p-0 md:w-1/4' : 'pb-0 flex-grow'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <div className="relative group-hover:block hidden md:block">
                            <button onClick={() => openModal(project)} className="text-gray-400 hover:text-blue-600 p-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="text-gray-400 hover:text-red-500 p-1 ml-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {project.client}
                      </p>
                      
                       {/* Financial Summary Snippet for Grid */}
                       {view === 'grid' && (
                           <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-3 rounded-xl text-xs">
                                <div>
                                    <div className="text-gray-400 uppercase tracking-wider mb-0.5" style={{fontSize: '0.65rem'}}>Total</div>
                                    <div className="font-bold text-gray-800">{project.budget ? `₹${project.budget.toLocaleString()}` : '₹0'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 uppercase tracking-wider mb-0.5" style={{fontSize: '0.65rem'}}>Pending</div>
                                    <div className={`font-bold ${pendingAmount > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        {pendingAmount ? `₹${pendingAmount.toLocaleString()}` : '₹0'}
                                    </div>
                                </div>
                           </div>
                       )}

                    </div>

                    {/* List Middle */}
                    {view === 'list' && (
                        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="block text-xs text-gray-400 uppercase">Deadline</span>
                                {project.deadline || 'N/A'}
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase">Total Amount</span>
                                {project.budget ? `₹${project.budget.toLocaleString()}` : '₹0'}
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase">Paid / Pending</span>
                                <div className="flex flex-col">
                                    <span className="text-green-600 font-medium">PD: ₹{project.paidAmount ? Number(project.paidAmount).toLocaleString() : '0'}</span>
                                    <span className={`text-xs ${pendingAmount > 0 ? 'text-red-500' : 'text-gray-400'}`}>PN: ₹{pendingAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shared Footer Area / List Right */}
                    <div className={`p-6 bg-gray-50 border-t border-gray-100 ${view === 'list' ? 'bg-transparent border-0 md:w-1/4' : 'mt-auto'}`}>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-semibold text-blue-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                        {view === 'grid' && (
                            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                                 <span>Due: {project.deadline || 'No Date'}</span>
                                 <span className={`px-2 py-0.5 rounded font-medium ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                            </div>
                        )}
                    </div>
                  </div>
                );
            })}
          </div>
        )}

      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto animate-fade-in-up">
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-20">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {currentProject ? 'Edit Project' : 'New Project'}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">Manage project details and finances</p>
                    </div>
                    <button onClick={closeModal} className="p-2 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                
                <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 md:space-y-8">
                    
                    {/* Section: Project Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Core Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                                    placeholder="e.g. Website Redesign"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name</label>
                                <input 
                                    name="client" 
                                    value={formData.client} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Section: Status & Timeline */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Status & Timeline</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_1rem_center]"
                                >
                                    <option>Planning</option>
                                    <option>In Progress</option>
                                    <option>On Hold</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority Level</label>
                                <select 
                                    name="priority" 
                                    value={formData.priority} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_1rem_center]"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                                <input 
                                    type="date"
                                    name="startDate" 
                                    value={formData.startDate} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Deadline</label>
                                <input 
                                    type="date"
                                    name="deadline" 
                                    value={formData.deadline} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                        {/* Section: Financials */}
                        <div className="md:col-span-2 space-y-4">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Financial Overview</h3>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</label>
                                    <input 
                                        type="number"
                                        name="budget" 
                                        value={formData.budget} 
                                        onChange={handleInputChange} 
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 shadow-sm"
                                        placeholder="0.00"
                                    />

                                </div>
                                <div className="space-y-1.5 relative">
                                    <label 
                                        className="text-xs font-bold text-gray-500 uppercase tracking-wider select-none cursor-help hover:text-blue-600 transition-colors"
                                        onClick={handleSecretTap}
                                        title="Tap 5 times to unlock edit"
                                    >
                                        Total Paid <span className="text-gray-300 mx-1">|</span> Secret Tap
                                    </label>
                                    <input 
                                        type="number"
                                        name="paidAmount" 
                                        value={formData.paidAmount} 
                                        onChange={handleInputChange}
                                        readOnly={!isPaymentEditable}
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all font-bold ${!isPaymentEditable ? 'bg-gray-100/50 border-gray-200 text-gray-500 cursor-not-allowed shadow-inner' : 'bg-white border-yellow-300 text-gray-800 ring-4 ring-yellow-500/20'}`}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-1.5 relative md:col-span-1 pt-4 md:pt-0">
                                    <div className="absolute inset-0 bg-red-500/5 rounded-2xl md:-mx-4 -mx-2 md:-my-4 -my-2 -z-10"></div>
                                    <label className="text-xs font-bold text-red-600 uppercase tracking-wider">
                                        Payment Pending
                                    </label>
                                    <div className="relative group/pending">
                                         <input 
                                            type="number"
                                            name="pendingAmount" 
                                            value={formData.pendingAmount} 
                                            onChange={handleInputChange}
                                            readOnly={!isPaymentEditable}
                                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all font-extrabold text-lg ${parseFloat(formData.pendingAmount) > 0 ? 'text-rose-600 border-rose-100 bg-rose-50/50' : 'text-emerald-600 border-emerald-100 bg-emerald-50/50'} ${!isPaymentEditable ? 'cursor-not-allowed shadow-inner' : 'bg-white ring-4 ring-yellow-500/20 border-yellow-300'}`}
                                            placeholder="0.00"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                            ₹
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-3 pt-6 border-t border-dashed border-gray-200">
                                    <button 
                                        type="button"
                                        onClick={openPaymentModal}
                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                                    >
                                        <svg className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Record New Payment
                                    </button>
                                </div>
                                {formData.paymentHistory && formData.paymentHistory.length > 0 && (
                                    <div className="md:col-span-3 mt-4">
                                        <label className="text-sm font-semibold text-gray-700 block mb-2">Payment History</label>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-600">
                                                    <tr>
                                                        <th className="p-2">Date</th>
                                                        <th 
                                                            className="p-2 select-none cursor-pointer hover:bg-gray-100 rounded transition-colors"
                                                            onClick={handleHistorySecretTap}
                                                            title="Tap 5 times to edit history"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th className="p-2">Mode</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {formData.paymentHistory.map((pay) => (
                                                        <tr key={pay.id}>
                                                            <td className="p-2">{pay.date}</td>
                                                            <td className="p-2 font-medium text-green-600">
                                                                {isHistoryEditable ? (
                                                                    <input 
                                                                        type="number"
                                                                        value={pay.amount}
                                                                        onChange={(e) => handleHistoryAmountChange(pay.id, e.target.value)}
                                                                        className="w-24 px-2 py-1 rounded border border-gray-200 focus:border-blue-500 outline-none text-sm font-bold text-green-700 bg-yellow-50"
                                                                        placeholder="0"
                                                                    />
                                                                ) : (
                                                                    `+₹${pay.amount.toLocaleString()}`
                                                                )}
                                                            </td>
                                                            <td className="p-2 text-gray-500">{pay.mode}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>



                    {/* Section: Additional Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Team & Scope</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Team Progress</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        name="progress" 
                                        value={formData.progress} 
                                        onChange={handleInputChange} 
                                        className="flex-grow h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                    />
                                    <div className="w-16 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 font-bold text-blue-600">
                                        {formData.progress}%
                                    </div>
                                </div>
                            </div>
                             <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Team Members</label>
                                <input 
                                    name="teamLead" 
                                    value={formData.teamLead} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
                                    placeholder="e.g. John Doe, Jane Smith..."
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 resize-none"
                                    placeholder="Detailed scope, requirements, and notes..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 bg-white sticky bottom-0 z-10 -mx-6 -mb-6 p-6">
                        <button 
                            type="button" 
                            onClick={closeModal}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 font-medium transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {currentProject ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {/* Payment Modal */}
      {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fade-in-up">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800">Add Payment</h3>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={submitPayment} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input 
                            type="number" 
                            name="amount"
                            value={paymentData.amount}
                            onChange={handlePaymentInputChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input 
                            type="date" 
                            name="date"
                            value={paymentData.date}
                            onChange={handlePaymentInputChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                        <select 
                            name="mode"
                            value={paymentData.mode}
                            onChange={handlePaymentInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                        >
                            <option>UPI</option>
                            <option>Cash</option>
                            <option>Online Banking</option>
                            <option>Check</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Save Payment
                    </button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default ProjectManagement;
