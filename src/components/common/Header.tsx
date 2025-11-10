import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User, ChevronDown, Settings, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  showMenuButton = false,
}) => {
  const { user, logout, activeRole, setActiveRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleRoleSwitch = (role: string) => {
    setActiveRole(role);
    setShowDropdown(false);
    setShowMobileMenu(false);
  };
  //   console.log("user---->");

  //   const availableRoles =
  //     user?.roles?.filter((role) => role.role !== activeRole) || [];

  const availableRoles = user?.type === activeRole ? [user] : [];

  return (
    <>
      <header className="bg-white dark:bg-dark-bg-primary border-b border-neutral-200 dark:border-dark-border-primary px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary transition-colors"
              >
                <Menu className="h-5 w-5 text-neutral-600 dark:text-dark-text-secondary" />
              </button>
            )}
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-dark-text-primary truncate transition-colors duration-200">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-dark-text-secondary mt-1 hidden sm:block transition-colors duration-200">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Role Switcher - Hidden on mobile, shown in mobile menu */}
            {user && (
              <>
                {/* Desktop Role Switcher */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-dark-bg-secondary hover:bg-neutral-200 dark:hover:bg-dark-bg-tertiary transition-colors"
                  >
                    <span className="text-sm font-medium capitalize text-neutral-900 dark:text-dark-text-primary">
                      {activeRole}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-dark-text-secondary" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-strong border border-neutral-200 dark:border-dark-border-primary py-1 z-50 animate-scale-in">
                      {availableRoles?.map((role) => (
                        <button
                          key={role?.type}
                          onClick={() => handleRoleSwitch(role?.type)}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary capitalize transition-colors"
                        >
                          Switch to {role?.type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="sm:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary transition-colors"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5 text-neutral-600 dark:text-dark-text-secondary" />
                  ) : (
                    <User className="h-5 w-5 text-neutral-600 dark:text-dark-text-secondary" />
                  )}
                </button>
              </>
            )}

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary truncate max-w-32">
                    {user?.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary truncate max-w-32">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-neutral-400 dark:text-dark-text-tertiary hover:text-neutral-600 dark:hover:text-dark-text-secondary transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile User Avatar (when no role switcher) */}
            {!user && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center"
              >
                <User className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-dark-bg-primary shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                  Account
                </h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-600 dark:text-dark-text-secondary" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-neutral-50 dark:bg-dark-bg-secondary rounded-lg">
                <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary">
                    {user?.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">
                    {user?.email}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 capitalize font-medium">
                    Current: {activeRole}
                  </p>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-3">
                  Theme
                </h4>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>

              {/* Role Switcher */}
              {user && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary mb-3">
                    Switch Role
                  </h4>
                  <div className="space-y-2">
                    {availableRoles.map((role) => (
                      <button
                        key={role?.type}
                        onClick={() => handleRoleSwitch(role?.type)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 dark:bg-dark-bg-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary transition-colors"
                      >
                        <span className="capitalize font-medium text-neutral-900 dark:text-dark-text-primary">
                          {role?.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
