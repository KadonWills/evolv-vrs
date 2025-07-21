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

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const toast = useToastContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      toast.error('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Invalid Password', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password, role);
      toast.success('Account Created', `Welcome ${name}! Your ${role} account has been created successfully.`);
      router.push(`/${role}/dashboard`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setError(errorMessage);
      toast.error('Registration Failed', errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">

      <Card className="w-full max-w-lg animate-fade-in" hover>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-elevated">
            <BriefcaseIcon size={24} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create Your Account
          </CardTitle>
          <p className="text-muted-foreground mt-2">Join the Vacation Request System today</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-scale-in shadow-soft">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                icon={<UserIcon size={18} />}
                required
              />
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
              <label htmlFor="role" className="block text-sm font-medium text-foreground">
                Account Type
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'employee' | 'manager')}
                  className="w-full h-12 rounded-xl border-2 border-input-border bg-input pl-10 pr-4 py-3 text-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary hover:border-primary/50"
                  aria-label="Select account type"
                >
                  <option value="employee">👤 Employee Account</option>
                  <option value="manager">👔 Manager Account</option>
                </select>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose Employee for requesting time off, or Manager for approving requests
              </p>
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
                placeholder="Create a secure password"
                icon={<LockIcon size={18} />}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
                  Creating Your Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};