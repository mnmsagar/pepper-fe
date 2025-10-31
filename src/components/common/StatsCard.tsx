import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600',
    info: 'from-info-500 to-info-600',
  };

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-soft border border-neutral-200 dark:border-dark-border-primary p-4 sm:p-6 hover:shadow-medium transition-all duration-200 touch-manipulation">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary truncate">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-neutral-500 dark:text-dark-text-tertiary ml-1 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={`h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center shadow-medium ml-4 flex-shrink-0`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;