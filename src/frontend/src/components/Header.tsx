import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Building2, LogOut, User } from 'lucide-react';
import { useGetCallerUserProfile, useGetCallerUserRole } from '../hooks/useQueries';

export default function Header() {
  const { identity, clear, login, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/logo-transparent.dim_200x200.png" alt="Listing Launchpad" className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-bold text-navy">Listing Launchpad</h1>
            <p className="text-xs text-muted-foreground">North Texas Real Estate Services</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{userProfile.name}</span>
              {userRole === 'admin' && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gold/20 text-gold-dark">
                  Admin
                </span>
              )}
            </div>
          )}
          
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={isAuthenticated ? '' : 'bg-navy hover:bg-navy/90 text-white'}
          >
            {isLoggingIn ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
