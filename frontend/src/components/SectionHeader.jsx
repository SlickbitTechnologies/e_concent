import React from 'react';
import { Button } from './ui/button';
import { CardHeader, CardTitle } from './ui/card';
import { Check, Lock } from 'lucide-react';

const SectionHeader = ({ 
  sectionNumber, 
  title, 
  description, 
  status, 
  onMarkComplete, 
  isCompleted, 
  colorScheme = 'blue' 
}) => {
  const colorClasses = {
    blue: {
      header: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      title: 'text-blue-800 dark:text-blue-200',
      description: 'text-blue-700 dark:text-blue-300',
      button: 'text-blue-600 border-blue-600 hover:bg-blue-50',
      enabled: 'bg-blue-600 text-white',
    },
    green: {
      header: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      title: 'text-green-800 dark:text-green-200',
      description: 'text-green-700 dark:text-green-300',
      button: 'text-green-600 border-green-600 hover:bg-green-50',
      enabled: 'bg-green-600 text-white',
    },
    purple: {
      header: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      title: 'text-purple-800 dark:text-purple-200',
      description: 'text-purple-700 dark:text-purple-300',
      button: 'text-purple-600 border-purple-600 hover:bg-purple-50',
      enabled: 'bg-purple-600 text-white',
    },
    orange: {
      header: 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      title: 'text-orange-800 dark:text-orange-200',
      description: 'text-orange-700 dark:text-orange-300',
      button: 'text-orange-600 border-orange-600 hover:bg-orange-50',
      enabled: 'bg-orange-600 text-white',
    },
    indigo: {
      header: 'bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
      title: 'text-indigo-800 dark:text-indigo-200',
      description: 'text-indigo-700 dark:text-indigo-300',
      button: 'text-indigo-600 border-indigo-600 hover:bg-indigo-50',
      enabled: 'bg-indigo-600 text-white',
    }
  };

  const colors = colorClasses[colorScheme];

  const getIconBgClass = () => {
    if (status === 'completed') return 'bg-green-600 text-white';
    if (status === 'enabled') return colors.enabled;
    return 'bg-gray-400 text-white';
  };

  const renderIcon = () => {
    if (status === 'completed') return <Check className="w-4 h-4" />;
    if (status === 'disabled') return <Lock className="w-4 h-4" />;
    return sectionNumber;
  };

  return (
    <CardHeader className={colors.header}>
      <div className="flex items-center justify-between">
        <CardTitle className={`${colors.title} flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getIconBgClass()}`}>
            {renderIcon()}
          </div>
          {title}
        </CardTitle>
        {status === 'enabled' && !isCompleted && (
          <Button 
            onClick={onMarkComplete}
            size="sm" 
            variant="outline"
            className={colors.button}
          >
            Mark Complete
          </Button>
        )}
        {status === 'completed' && (
          <div className="text-green-600 text-sm font-medium flex items-center gap-1">
            <Check className="w-4 h-4" />
            Completed
          </div>
        )}
      </div>
      <p className={`text-sm ${colors.description} mt-2`}>{description}</p>
    </CardHeader>
  );
};

export default SectionHeader;
