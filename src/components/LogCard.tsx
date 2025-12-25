import { LogEntry } from '@/types/log';
import { FileText, Image, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogCardProps {
  log: LogEntry;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const typeConfig = {
  text: {
    icon: FileText,
    label: 'Text',
    className: 'bg-primary/10 text-primary',
  },
  media: {
    icon: Image,
    label: 'Media',
    className: 'bg-accent/10 text-accent',
  },
  mixed: {
    icon: Layers,
    label: 'Mixed',
    className: 'bg-warning/10 text-warning',
  },
};

export function LogCard({ log, onClick, style }: LogCardProps) {
  const config = typeConfig[log.type];
  const Icon = config.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <button
      onClick={onClick}
      style={style}
      className="w-full text-left glass rounded-xl p-4 hover:bg-card/90 transition-all duration-200 hover:shadow-md active:scale-[0.99] animate-fade-up"
    >
      <div className="flex items-start gap-3">
        {/* Media preview or icon */}
        {log.type !== 'text' && log.mediaUrls?.[0] ? (
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={log.mediaUrls[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
            config.className
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              config.className
            )}>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(log.createdAt)}
            </span>
          </div>
          
          <h3 className="font-semibold text-foreground truncate">
            {log.title}
          </h3>
          
          {log.content && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {log.content}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
