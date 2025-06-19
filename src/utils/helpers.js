export const getThemeClasses = (isDarkMode) => {
  return isDarkMode 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';
};

export const getCardClasses = (isDarkMode) => {
  return isDarkMode
    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700/50'
    : 'bg-white/80 backdrop-blur-sm border-white/20';
};

export const getInputClasses = (isDarkMode) => {
  return isDarkMode
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400'
    : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'WIP': return 'bg-blue-100 text-blue-800';
    case 'Yet to Start': return 'bg-gray-100 text-gray-800';
    case 'Delayed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
