import { useState } from 'react';
import { X, Image, FileText, Layers, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LogType } from '@/types/log';
import { cn } from '@/lib/utils';

interface CreateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content?: string; mediaUrls?: string[]; type: LogType }) => void;
}

const logTypes = [
  { type: 'text' as LogType, icon: FileText, label: 'Text Only' },
  { type: 'mixed' as LogType, icon: Layers, label: 'Text & Media' },
  { type: 'media' as LogType, icon: Image, label: 'Media Only' },
];

export function CreateLogModal({ isOpen, onClose, onSubmit }: CreateLogModalProps) {
  const [selectedType, setSelectedType] = useState<LogType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setMediaFiles(prev => [...prev, ...urls]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      content: selectedType !== 'media' ? content.trim() : undefined,
      mediaUrls: selectedType !== 'text' ? mediaFiles : undefined,
      type: selectedType,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setMediaFiles([]);
    setSelectedType('text');
    onClose();
  };

  const isValid = title.trim() && (
    (selectedType === 'text' && content.trim()) ||
    (selectedType === 'media' && mediaFiles.length > 0) ||
    (selectedType === 'mixed' && (content.trim() || mediaFiles.length > 0))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg glass-strong rounded-t-2xl sm:rounded-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">New Log Entry</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Type Selection */}
        <div className="flex gap-2 mb-6">
          {logTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                selectedType === type
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                selectedType === type ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                selectedType === type ? "text-primary" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="space-y-4">
          <Input
            placeholder="Log title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />

          {/* Text Content */}
          {selectedType !== 'media' && (
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          )}

          {/* Media Upload */}
          {selectedType !== 'text' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Camera</span>
                  </div>
                </label>
              </div>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaFiles.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground/80 text-background flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full mt-6"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Create Log
        </Button>
      </div>
    </div>
  );
}
