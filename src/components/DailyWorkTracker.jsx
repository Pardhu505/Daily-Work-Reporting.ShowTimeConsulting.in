import React, { useState, useEffect } from 'react';
import { Download, FileText, Users, Moon, Sun } from 'lucide-react';
import { departmentData, statusOptions } from '../utils/constants';
import { 
  getThemeClasses, 
  getCardClasses, 
  getInputClasses, 
  getStatusColor 
} from '../utils/helpers';

const DailyWorkTracker = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    department: '',
    team: '',
    reportingManager: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    tasks: '',
    status: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    department: '',
    team: '',
    reportingManager: ''
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    
    if (field === 'department') {
      setFormData(prev => ({...prev, team: '', reportingManager: ''}));
    }
    
    if (field === 'team') {
      setFormData(prev => ({...prev, reportingManager: ''}));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({...prev, [field]: value}));
    
    if (field === 'department') {
      setFilters(prev => ({...prev, team: '', reportingManager: ''}));
    }
    
    if (field === 'team') {
      setFilters(prev => ({...prev, reportingManager: ''}));
    }
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.team || !formData.reportingManager || 
        !formData.employeeName || !formData.date || !formData.tasks || !formData.status) {
      setSuccessMessage('Please fill in all required fields.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }
    
    const newReport = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    try {
      setReports(prev => [...prev, newReport]);
      setSuccessMessage('Report submitted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setFormData({
        department: '',
        team: '',
        reportingManager: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        tasks: '',
        status: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      setSuccessMessage('Error submitting report. Please try again.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  useEffect(() => {
    if (!filters.department && !filters.team && !filters.reportingManager) {
      setFilteredReports(reports);
      return;
    }
    
    const filtered = reports.filter(report => {
      return (!filters.department || report.department === filters.department) &&
             (!filters.team || report.team === filters.team) &&
             (!filters.reportingManager || report.reportingManager === filters.reportingManager);
    });
    
    setFilteredReports(filtered);
  }, [filters, reports]);

  const getTeamsForDepartment = (department) => {
    return department && departmentData[department] ? Object.keys(departmentData[department]) : [];
  };

  const getReportingManagersForTeam = (department, team) => {
    return department && team && departmentData[department] && departmentData[department][team] 
      ? departmentData[department][team] : [];
  };

  const exportToCSV = () => {
    const dataToExport = filteredReports.length > 0 ? filteredReports : reports;
    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }
    
    const csvContent = [
      ['Date', 'Employee Name', 'Department', 'Team', 'Reporting Manager', 'Status', 'Tasks'],
      ...dataToExport.map(report => [
        new Date(report.date).toLocaleDateString(),
        report.employeeName,
        report.department,
        report.team,
        report.reportingManager,
        report.status,
        report.tasks
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work_reports.csv';
    a.click();
  };

 const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'WIP': return 'bg-blue-100 text-blue-800';
      case 'Yet to Start': return 'bg-gray-100 text-gray-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getThemeClasses()}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className={`${getCardClasses()} rounded-3xl p-6 mb-8 shadow-xl border animate-fade-in`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Updated Showtime Logo */}
               <link rel="icon" type="image/svg+xml" href="https://showtimeconsulting.in/images/settings/2fd13f50.png" /></div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SHOWTIME</h1>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CONSULTING</p>
              </div>
              <div className={`hidden lg:block h-8 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} mx-2`}></div>
              <div className="hidden lg:block">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Daily Work Report</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setActiveTab('report')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'report'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg -translate-y-1'
                    : isDarkMode
                      ? 'bg-gray-700 text-indigo-300 border-2 border-indigo-400 hover:bg-gray-600'
                      : 'bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Daily Report
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'summary'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg -translate-y-1'
                    : isDarkMode
                      ? 'bg-gray-700 text-indigo-300 border-2 border-indigo-400 hover:bg-gray-600'
                      : 'bg-white text-indigo-500 border-2 border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                RM's Team Report
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`${
            successMessage.includes('Error') || successMessage.includes('Please fill')
              ? isDarkMode ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-red-100 border-red-400 text-red-700'
              : isDarkMode ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-green-100 border-green-400 text-green-700'
          } px-6 py-4 rounded-2xl mb-6 shadow-md border animate-bounce-in`}>
            {successMessage}
          </div>
        )}

        {/* Report Form Tab */}
        {activeTab === 'report' && (
          <div className={`${getCardClasses()} rounded-3xl p-8 shadow-xl border animate-slide-up`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md ${getInputClasses()}`}
                  >
                    <option value="">Select Department</option>
                    {Object.keys(departmentData).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Team *
                  </label>
                  <select
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    required
                    disabled={!formData.department}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md disabled:opacity-50 ${getInputClasses()}`}
                  >
                    <option value="">Select Team</option>
                    {getTeamsForDepartment(formData.department).map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Reporting Manager *
                  </label>
                  <select
                    value={formData.reportingManager}
                    onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                    required
                    disabled={!formData.team}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md disabled:opacity-50 ${getInputClasses()}`}
                  >
                    <option value="">Select Reporting Manager</option>
                    {getReportingManagersForTeam(formData.department, formData.team).map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md ${getInputClasses()}`}
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md ${getInputClasses()}`}
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md ${getInputClasses()}`}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Task Details *
                </label>
                <textarea
                  value={formData.tasks}
                  onChange={(e) => handleInputChange('tasks', e.target.value)}
                  placeholder="Enter detailed task description..."
                  required
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 group-hover:shadow-md resize-vertical ${getInputClasses()}`}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                  <FileText className="w-5 h-5 inline mr-2" />
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">RM's Team Work Report</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter by Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="">All Departments</option>
                    {Object.keys(departmentData).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter by Team
                  </label>
                  <select
                    value={filters.team}
                    onChange={(e) => handleFilterChange('team', e.target.value)}
                    disabled={!filters.department}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                  >
                    <option value="">All Teams</option>
                    {getTeamsForDepartment(filters.department).map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter by Reporting Manager
                  </label>
                  <select
                    value={filters.reportingManager}
                    onChange={(e) => handleFilterChange('reportingManager', e.target.value)}
                    disabled={!filters.team}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                  >
                    <option value="">All Reporting Managers</option>
                    {getReportingManagersForTeam(filters.department, filters.team).map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Team</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reporting Manager</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {report.employeeName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {report.department}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {report.team}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {report.reportingManager}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={report.tasks}>
                            {report.tasks.length > 100 ? `${report.tasks.substring(0, 100)}...` : report.tasks}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyWorkTracker;
