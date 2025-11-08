import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const success = onLogin(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-100/10 to-primary-200/10 rounded-full animate-pulse-slow"></div>
      </div>
      
      <div className="relative max-w-md w-full space-y-8 p-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6 animate-bounce-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
              <div className="relative flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg shadow-blue-500/25">
                <svg className="h-8 w-8 text-primary animate-float" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path d="M158.9,89.16l-32-18-32,18L26.3,121.84,128,183.33l101.7-61.49ZM128,34,32.23,92.4,128,150.8,223.77,92.4ZM232,104.75v50.5a8,8,0,0,1-4.37,7.26l-96,54.86a7.9,7.9,0,0,1-7.26,0l-96-54.86A8,8,0,0,1,24,155.25v-50.5a8,8,0,0,1,4.37-7.26L52,83.17V144a8,8,0,0,0,16,0V100.8l52.37,29.93a8,8,0,0,0,7.26,0L180,100.8V144a8,8,0,0,0,16,0V83.17l23.63,14.32A8,8,0,0,1,232,104.75Z"></path>
                </svg>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Apexsoft
                </h1>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Sign in to access your admin dashboard
          </p>
        </div>
        {/* Login Form */}
        <form className="mt-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }} onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 space-y-6 border border-gray-100">
            <div className="space-y-4">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 py-3"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 py-3"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-fade-in-down bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}


          {/* Submit Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <Button as="button" type="submit" disabled={isLoading} className="w-full btn-animated">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="loading-dots">Signing in</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
