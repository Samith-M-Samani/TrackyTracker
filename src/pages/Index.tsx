import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from './Auth';
import Dashboard from './Dashboard';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Initialize theme based on device settings
  useTheme();

  useEffect(() => {
    // Check for existing session
    const user = localStorage.getItem('dailylogs_current_user');
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('dailylogs_current_user');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-xl gradient-primary animate-pulse-soft" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return <Dashboard username={currentUser} onLogout={handleLogout} />;
};

export default Index;
