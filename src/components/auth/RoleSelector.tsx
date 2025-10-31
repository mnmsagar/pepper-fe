import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Building, User, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RoleSelector: React.FC = () => {
  const { user, setActiveRole, activeRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles.length === 1 || activeRole) {
    const role = activeRole || user.roles[0]?.role;
    return <Navigate to={`/${role}`} replace />;
  }

  const handleRoleSelect = (role: string) => {
    setActiveRole(role);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'partner':
        return Building;
      case 'member':
        return User;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-error-500 to-error-600';
      case 'partner':
        return 'from-primary-500 to-primary-600';
      case 'member':
        return 'from-success-500 to-success-600';
      default:
        return 'from-neutral-500 to-neutral-600';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Manage platform, partners, and rewards';
      case 'partner':
        return 'Buy coins and reward customers';
      case 'member':
        return 'Earn and redeem loyalty coins';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Coins className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2 transition-colors duration-200">Welcome, {user.name}!</h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base transition-colors duration-200">Select your role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {user.roles.map((userRole) => {
            const Icon = getRoleIcon(userRole.role);
            const colorClass = getRoleColor(userRole.role);
            
            return (
              <button
                key={userRole.role}
                onClick={() => handleRoleSelect(userRole.role)}
                className="w-full group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-secondary p-4 sm:p-6 text-left hover:border-neutral-300 dark:hover:border-dark-border-secondary hover:shadow-medium transition-all duration-200 touch-manipulation active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-r ${colorClass} text-white shadow-medium group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary capitalize truncate">
                      {userRole.role} Dashboard
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary truncate">
                      {getRoleDescription(userRole.role)}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-400 dark:text-dark-text-tertiary text-xl">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-neutral-500 dark:text-dark-text-tertiary transition-colors duration-200">
            You can switch roles anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;