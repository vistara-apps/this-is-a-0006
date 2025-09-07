import React from 'react';
import { Lightbulb, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

interface AppShellProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function AppShell({ children, currentView, onNavigate }: AppShellProps) {
  const { user, logout } = useAuth();

  if (currentView === 'landing') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => onNavigate('dashboard')}
              >
                <Lightbulb className="h-8 w-8 text-primary-500" />
                <h1 className="text-xl font-bold text-textPrimary">ConceptCraft AI</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-2 text-sm text-textSecondary">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                    <span className="bg-accent-500 text-white px-2 py-1 rounded text-xs">
                      {user.subscriptionTier.toUpperCase()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}