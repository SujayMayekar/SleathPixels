import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberButton } from "@/components/ui/cyber-button";
import { FileUpload } from "@/components/ui/file-upload";
import { useSteganography } from "@/hooks/use-steganography";
import { LockKeyhole, UnlockKeyhole, Download, Copy, ShieldCheck, EyeOff, Key, History, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function Hero() {
  return (
    <div className="text-center py-16 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-primary mr-2" />
          <span className="text-xs font-mono text-primary font-bold tracking-wider uppercase">Zero-Trace Encoding</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 text-glow font-display">
          Stegano<span className="text-primary">Safe</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
          Advanced pixel-layer encryption. Hide secrets in plain sight with AES-256 armored steganography.
          100% Client-Side. No server footprint. Pure Privacy.
        </p>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}

function EncodeSection() {
  const { encodeMessage, isProcessing, calculateCapacity } = useSteganography();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<number>(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(e.target?.result as string);
        setCapacity(calculateCapacity(img.width, img.height));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
    setEncodedImage(null);
  };

  const handleEncode = async () => {
    if (!file || !message) return;
    const result = await encodeMessage(file, message, password);
    if (result) {
      setEncodedImage(result);
      toast({
        title: "Encryption Complete",
        description: "Your message has been hidden inside the image pixels.",
      });
    }
  };

  const downloadImage = () => {
    if (!encodedImage) return;
    const link = document.createElement("a");
    link.href = encodedImage;
    link.download = `stegasafe-${Date.now()}.png`;
    link.click();
  };

  const capacityUsed = (message.length + 15) / (capacity || 1) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center font-display">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3 text-primary">1</span>
            Select Image
          </h3>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center font-display">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3 text-primary">2</span>
            Security Layers
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-2 block uppercase tracking-widest">Secret Message</label>
              <textarea 
                className="w-full h-24 bg-background/50 border border-input rounded-xl p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-mono text-sm"
                placeholder="Message to hide..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <span className={cn(capacityUsed > 90 ? "text-destructive" : "text-muted-foreground")}>Capacity: {Math.floor(capacityUsed)}%</span>
                  <span>{message.length} chars</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full", capacityUsed > 90 ? "bg-destructive" : "bg-primary")}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(capacityUsed, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-mono text-muted-foreground mb-2 block uppercase tracking-widest">Optional Encryption Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password"
                  className="w-full bg-background/50 border border-input rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono text-sm"
                  placeholder="AES-256 password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <CyberButton 
          className="w-full py-6 text-lg font-display" 
          disabled={!file || !message || capacityUsed > 100}
          onClick={handleEncode}
          isLoading={isProcessing}
        >
          <LockKeyhole className="mr-2 h-5 w-5" />
          INITIATE ENCODING
        </CyberButton>
      </div>

      <div className="space-y-6">
        <div className="bg-card/30 backdrop-blur-md border border-border rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-bold mb-6 font-display">Encoded Output</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[300px]">
            {encodedImage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/30 bg-black/50">
                   <img src={encodedImage} alt="Encoded" className="w-full h-full object-contain" />
                </div>
                <CyberButton variant="secondary" onClick={downloadImage} className="w-full font-display">
                  <Download className="mr-2 h-4 w-4" />
                  DOWNLOAD PNG
                </CyberButton>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground/30 font-mono">
                <EyeOff className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>AWAITING DATA_</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DecodeSection() {
  const { decodeMessage, isProcessing } = useSteganography();
  const { toast } = useToast();
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setPendingFile(file);
    setDecodedMessage(null);
  };

  const handleDecode = async () => {
    if (!pendingFile) return;
    const result = await decodeMessage(pendingFile, password);
    if (result) {
      setDecodedMessage(result);
      toast({
        title: "Message Found!",
        description: "Successfully decoded hidden message from image.",
      });
    }
  };

  const copyMessage = () => {
    if (!decodedMessage) return;
    navigator.clipboard.writeText(decodedMessage);
    toast({ title: "Copied!", description: "Message copied to clipboard" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display">1. Source Image</h3>
            <FileUpload onFileSelect={handleFileSelect} label="Upload Encrypted PNG" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display">2. Credentials</h3>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password"
                className="w-full bg-background/50 border border-input rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                placeholder="AES Password (if any)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <CyberButton 
              className="w-full font-display" 
              onClick={handleDecode} 
              isLoading={isProcessing}
              disabled={!pendingFile}
            >
              <UnlockKeyhole className="mr-2 h-4 w-4" />
              REVEAL MESSAGE
            </CyberButton>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {decodedMessage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 border border-primary/30 rounded-2xl p-8">
            <h3 className="text-xl font-mono text-primary mb-4 flex items-center">
              <UnlockKeyhole className="mr-2 w-5 h-5" />
              REVEALED_DATA:
            </h3>
            <div className="bg-black/60 rounded-xl p-6 font-mono text-lg text-primary shadow-inner border border-primary/10 whitespace-pre-wrap">
              {decodedMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HistorySection() {
  const { history } = useSteganography();
  return (
    <div className="max-w-2xl mx-auto mt-20 opacity-50 hover:opacity-100 transition-opacity">
      <h3 className="text-xs font-mono text-muted-foreground mb-4 flex items-center uppercase tracking-widest justify-center">
        <History className="w-3 h-3 mr-2" />
        Local Session History
      </h3>
      <div className="space-y-2">
        {history.length > 0 ? history.map((item) => (
          <div key={item.id} className="bg-card/30 border border-border p-3 rounded-lg flex justify-between items-center font-mono text-[10px]">
            <span className={cn("px-2 py-0.5 rounded uppercase font-bold", item.action === 'encode' ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary")}>
              {item.action}
            </span>
            <span className="text-muted-foreground truncate max-w-[150px]">{item.filename}</span>
            <span className="text-muted-foreground/50">{new Date(item.timestamp).toLocaleTimeString()}</span>
          </div>
        )) : (
          <p className="text-center text-[10px] font-mono text-muted-foreground/30 italic">No recent local activity_</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <Hero />
        <div className="flex justify-center mb-12">
          <div className="bg-card/50 backdrop-blur-md p-1 rounded-xl border border-border inline-flex shadow-lg font-display">
            <button onClick={() => setActiveTab('encode')} className={cn("px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2", activeTab === 'encode' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5")}>
              <LockKeyhole className="w-4 h-4" /> ENCODE
            </button>
            <button onClick={() => setActiveTab('decode')} className={cn("px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2", activeTab === 'decode' ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-white/5")}>
              <UnlockKeyhole className="w-4 h-4" /> DECODE
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              {activeTab === 'encode' ? <EncodeSection /> : <DecodeSection />}
            </motion.div>
          </AnimatePresence>
        </div>
        <HistorySection />
      </div>
    </div>
  );
}
