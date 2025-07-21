'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BriefcaseIcon, LogOutIcon, UserIcon } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleEmoji = (role: string) => {
    return role === 'manager' ? '👔' : '👤';
  };

  const getRoleColor = (role: string) => {
    return role === 'manager' ? 'text-purple-600' : 'text-blue-600';
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm shadow-soft sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <BriefcaseIcon size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Vacation Request System
                </h1>
                {user && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{getRoleEmoji(user.role)}</span>
                    <p className="text-sm text-muted-foreground">
                      Welcome, <span className={`font-medium ${getRoleColor(user.role)}`}>{user.name}</span>
                      <span className="text-xs ml-1 capitalize bg-muted px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl">
                  <UserIcon size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <LogOutIcon size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};