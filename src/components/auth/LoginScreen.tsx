import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Smartphone, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, user, currentUserRole, loading: authLoading } = useAuth();

  // Show loading spinner while auth context is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated && user && currentUserRole) {
    console.log('🔄 Redirecting authenticated user:', user.email, 'Role:', currentUserRole.role);
    
    const roleRouteMap: { [key: string]: string } = {
      'admin': '/admin',
      'admin_employee': '/admin',
      'partner': '/partner',
      'partner_employee': '/partner',
      'member': '/member'
    };
    
    const redirectPath = roleRouteMap[currentUserRole.role] || '/member';
    console.log('🎯 Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted with:', { email, loginType });
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login...');
      const success = await login(email, password);
      
      if (success) {
        console.log('✅ Login successful, waiting for redirect...');
        // Don't set loading to false here - let the redirect handle it
      } else {
        console.log('❌ Login failed');
        setError('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Coins className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2 transition-colors duration-200">Welcome to PepperLoyal</h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base transition-colors duration-200">Sign in to your loyalty platform account</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-lg p-4 transition-colors duration-200">
          <h3 className="font-medium text-info-900 dark:text-info-300 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-info-800 dark:text-info-400 space-y-1">
            <p><strong>Admin:</strong> admin@peppermint.in</p>
            <p><strong>Partner:</strong> partner@example.com</p>
            <p><strong>member:</strong> member@example.com</p>
            <p><strong>Password:</strong> password123</p>
            <p className="text-xs mt-2 text-info-600 dark:text-info-500">
              <strong>Note:</strong> Using dummy authentication (no backend required)
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-6 sm:mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Login Type Toggle */}
            <div className="flex bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg p-1 transition-colors duration-200">
              <button
                type="button"
                onClick={() => setLoginType('email')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all touch-manipulation ${
                  loginType === 'email'
                    ? 'bg-white dark:bg-dark-bg-tertiary text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary'
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType('phone')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all touch-manipulation ${
                  loginType === 'phone'
                    ? 'bg-white dark:bg-dark-bg-tertiary text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary'
                }`}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Phone
              </button>
            </div>

            {/* Email/Phone Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                {loginType === 'email' ? 'Email address' : 'Phone number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginType === 'email' ? (
                    <Mail className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
                  )}
                </div>
                <input
                  id="email"
                  name="email"
                  type={loginType === 'email' ? 'email' : 'tel'}
                  autoComplete={loginType === 'email' ? 'email' : 'tel'}
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-4 border border-neutral-300 dark:border-dark-border-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary text-neutral-900 dark:text-dark-text-primary bg-white dark:bg-dark-bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 text-base transition-colors duration-200"
                  placeholder={loginType === 'email' ? 'Email address' : 'Phone number'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400 dark:text-dark-text-tertiary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-4 border border-neutral-300 dark:border-dark-border-primary placeholder-neutral-500 dark:placeholder-dark-text-tertiary text-neutral-900 dark:text-dark-text-primary bg-white dark:bg-dark-bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 text-base transition-colors duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 p-4 transition-colors duration-200">
              <div className="text-sm text-error-700 dark:text-error-400">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {loginType === 'phone' && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium touch-manipulation transition-colors duration-200"
              >
                Send OTP instead
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;