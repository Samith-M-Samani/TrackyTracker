import { useState, useEffect } from 'react';
import { Plus, LogOut, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogCard } from '@/components/LogCard';
import { CreateLogModal } from '@/components/CreateLogModal';
import { LogEntry, LogType } from '@/types/log';
import { toast } from 'sonner';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export default function Dashboard({ username, onLogout }: DashboardProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load logs from localStorage
  useEffect(() => {
    const storedLogs = localStorage.getItem(`dailylogs_${username}`);
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs).map((log: LogEntry) => ({
        ...log,
        createdAt: new Date(log.createdAt),
        updatedAt: new Date(log.updatedAt),
      }));
      setLogs(parsedLogs);
    }
  }, [username]);

  // Save logs to localStorage
  const saveLogs = (newLogs: LogEntry[]) => {
    localStorage.setItem(`dailylogs_${username}`, JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  const handleCreateLog = (data: { title: string; content?: string; mediaUrls?: string[]; type: LogType }) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      mediaUrls: data.mediaUrls,
      type: data.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedLogs = [newLog, ...logs];
    saveLogs(updatedLogs);
    toast.success('Log created successfully!');
  };

  const filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayLogs = logs.filter(log => {
    const today = new Date();
    const logDate = new Date(log.createdAt);
    return logDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--gradient-surface)' }}>
      {/* Header */}
      <header className="glass-strong sticky top-0 z-40 px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{getGreeting()}</h1>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-xl p-4 animate-fade-up">
            <p className="text-2xl font-bold text-foreground">{todayLogs.length}</p>
            <p className="text-sm text-muted-foreground">Today's Logs</p>
          </div>
          <div className="glass rounded-xl p-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <p className="text-2xl font-bold text-foreground">{logs.length}</p>
            <p className="text-sm text-muted-foreground">Total Logs</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogCard 
                key={log.id} 
                log={log}
                style={{ animationDelay: `${0.15 + index * 0.05}s` }}
              />
            ))
          ) : (
            <div className="text-center py-12 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {searchQuery ? 'No logs found' : 'No logs yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Create your first log entry!'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <Button
        variant="fab"
        size="fab"
        className="fixed bottom-6 right-6 z-50 animate-scale-in"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create Modal */}
      <CreateLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLog}
      />
    </div>
  );
}
