import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthPageProps {
  onLogin: (username: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock users storage (will be replaced with real DB)
  const getUsers = () => {
    const users = localStorage.getItem('dailylogs_users');
    return users ? JSON.parse(users) : {};
  };

  const saveUser = (username: string, password: string) => {
    const users = getUsers();
    users[username] = password;
    localStorage.setItem('dailylogs_users', JSON.stringify(users));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();

    if (isLogin) {
      // Login logic
      if (users[username] && users[username] === password) {
        localStorage.setItem('dailylogs_current_user', username);
        onLogin(username);
        toast.success(`Welcome back, ${username}!`);
        navigate('/');
      } else {
        toast.error('Invalid username or password');
      }
    } else {
      // Signup logic
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (users[username]) {
        toast.error('Username already exists');
      } else {
        saveUser(username, password);
        localStorage.setItem('dailylogs_current_user', username);
        onLogin(username);
        toast.success('Account created successfully!');
        navigate('/');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--gradient-surface)' }}>
      {/* Logo */}
      <div className="mb-8 animate-fade-up">
        <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-glow mx-auto mb-4">
          <BookOpen className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-center text-foreground">Daily Logs</h1>
        <p className="text-muted-foreground text-center text-sm mt-1">Your personal journal</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm glass-strong rounded-2xl p-6 shadow-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Toggle */}
        <div className="flex p-1 bg-muted rounded-lg mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              !isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Username
            </label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="animate-fade-up">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Confirm Password
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        Track your daily thoughts, tasks & memories
      </p>
    </div>
  );
}
