import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileImage, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/png, image/jpeg", 
  maxSizeMB = 5,
  label = "Drop image here or click to upload",
  className 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Simple validation could be expanded
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Max size is ${maxSizeMB}MB`);
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("relative group cursor-pointer", className)}>
      <div
        className={cn(
          "relative h-48 w-full rounded-xl border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center justify-center p-6 text-center overflow-hidden",
          dragActive 
            ? "border-primary bg-primary/10 scale-[1.02] shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]" 
            : "border-muted-foreground/20 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {!fileName ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="p-3 rounded-full bg-background border border-border shadow-inner">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG (Best) & JPG
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <FileImage className="h-10 w-10 text-primary" />
              </div>
              <div className="max-w-[200px] truncate text-sm font-medium text-primary">
                {fileName}
              </div>
              <button 
                onClick={clearFile}
                className="absolute -top-2 -right-12 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tech decoration lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
      </div>
    </div>
  );
}
