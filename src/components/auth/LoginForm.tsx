'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { UserIcon, MailIcon, LockIcon, BriefcaseIcon } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const toast = useToastContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('LoginForm handleSubmit called with:', { email, role });

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Missing Information', 'Please fill in all fields');
      return;
    }

    try {
      console.log('LoginForm calling login...');
      await login(email, password, role);
      console.log('LoginForm login successful, showing success toast and redirecting...');
      toast.success('Login Successful', `Welcome back! Redirecting to your ${role} dashboard.`);
      router.push(`/${role}/dashboard`);
    } catch (err) {
      console.error('LoginForm login error:', err);
      setError('Invalid credentials. Please try again.');
      toast.error('Login Failed', 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">

      <Card className="w-full max-w-md animate-fade-in" hover>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-elevated">
            <BriefcaseIcon size={24} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Vacation Request System
          </CardTitle>
          <p className="text-muted-foreground mt-2">Welcome back! Please sign in to continue.</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-scale-in shadow-soft">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-foreground">
                Select Role
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'employee' | 'manager')}
                  className="w-full h-12 rounded-xl border-2 border-input-border bg-input pl-10 pr-4 py-3 text-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary hover:border-primary/50"
                  aria-label="Select your role"
                >
                  <option value="employee">👤 Employee</option>
                  <option value="manager">👔 Manager</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                icon={<MailIcon size={18} />}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<LockIcon size={18} />}
                required
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Signing you in...
                </div>
              ) : (
                'Sign In to Continue'
              )}
            </Button>
          </form>

          {/* Demo credentials and registration link */}
          <div className="space-y-6">
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <BriefcaseIcon size={16} className="text-blue-600" />
                <h3 className="font-semibold text-blue-900 text-sm">Demo Credentials</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Employee:</span>
                  <code className="bg-white px-2 py-1 rounded text-blue-800">john@izsoftwares.com</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Manager:</span>
                  <code className="bg-white px-2 py-1 rounded text-blue-800">jane@izsoftwares.com</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">Password:</span>
                  <span className="text-blue-600">Any password works</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};