import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberButton } from "@/components/ui/cyber-button";
import { FileUpload } from "@/components/ui/file-upload";
import { useSteganography } from "@/hooks/use-steganography";
import { LockKeyhole, UnlockKeyhole, Download, Copy, Share2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Components for this page ---

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
          <span className="text-xs font-mono text-primary font-bold tracking-wider">CLIENT-SIDE ENCRYPTION</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 text-glow font-display">
          Stegano<span className="text-primary">Safe</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Hide secrets in plain sight. Deep-layer pixel manipulation with cryptographic precision.
          No server footprints. No traces. Pure encryption.
        </p>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}

function EncodeSection() {
  const { encodeMessage, isProcessing } = useSteganography();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
    
    // Reset output
    setEncodedImage(null);
  };

  const handleEncode = async () => {
    if (!file || !message) return;
    
    const result = await encodeMessage(file, message);
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyDataUri = () => {
    if (!encodedImage) return;
    navigator.clipboard.writeText(encodedImage);
    toast({ title: "Copied!", description: "Image data URI copied to clipboard" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Column */}
      <div className="space-y-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3 text-primary">1</span>
            Select Image
          </h3>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3 text-primary">2</span>
            Secret Message
          </h3>
          <textarea 
            className="w-full h-32 bg-background/50 border border-input rounded-xl p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-mono text-sm"
            placeholder="Enter your secret text here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{message.length} chars</span>
            <span>Supports emojis & special characters</span>
          </div>
        </div>

        <CyberButton 
          className="w-full py-6 text-lg" 
          disabled={!file || !message}
          onClick={handleEncode}
          isLoading={isProcessing}
        >
          <LockKeyhole className="mr-2 h-5 w-5" />
          Encode Message
        </CyberButton>
      </div>

      {/* Output Column */}
      <div className="space-y-6">
        <div className="bg-card/30 backdrop-blur-md border border-border rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-bold mb-6">Result Preview</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[300px]">
            {encodedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-4"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/30 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] bg-black/50">
                   <img src={encodedImage} alt="Encoded" className="w-full h-full object-contain" />
                   <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded shadow-lg">
                     ENCRYPTED
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CyberButton variant="secondary" onClick={downloadImage} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </CyberButton>
                </div>
              </motion.div>
            ) : previewUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-black/50 opacity-50 grayscale">
                 <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="bg-background/80 backdrop-blur px-4 py-2 rounded-full text-sm font-mono border border-border">Waiting to encode...</span>
                 </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground/50">
                <EyeOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No image generated yet</p>
              </div>
            )}
          </div>
          
          {/* Decorative scanner line */}
          {isProcessing && (
            <motion.div 
              className="absolute inset-0 bg-primary/10 border-t border-primary/50"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ height: "4px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DecodeSection() {
  const { decodeMessage, isProcessing } = useSteganography();
  const { toast } = useToast();
  
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setDecodedMessage(null);
    const result = await decodeMessage(file);
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
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl text-center">
        <h3 className="text-2xl font-bold mb-6">Upload Encoded Image</h3>
        <div className="max-w-xl mx-auto">
          <FileUpload onFileSelect={handleFileSelect} label="Drop encoded PNG here to reveal secrets" />
        </div>
      </div>

      <AnimatePresence>
        {(decodedMessage || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/40 backdrop-blur-md border border-primary/30 rounded-2xl p-8 shadow-[0_0_50px_-20px_hsl(var(--primary)/0.2)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <h3 className="text-xl font-mono text-primary mb-4 flex items-center">
              <UnlockKeyhole className="mr-2 w-5 h-5" />
              DECODED MESSAGE_
            </h3>

            {isProcessing ? (
              <div className="flex items-center justify-center py-12 space-x-3 text-primary/80 font-mono">
                <span className="animate-pulse">DECRYPTING_PIXELS...</span>
              </div>
            ) : (
              <div className="relative group">
                <div className="bg-black/60 rounded-xl p-6 font-mono text-lg leading-relaxed text-primary shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] min-h-[100px] whitespace-pre-wrap border border-primary/20">
                  {decodedMessage}
                </div>
                <button 
                  onClick={copyMessage}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <Hero />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-card/50 backdrop-blur-md p-1 rounded-xl border border-border inline-flex shadow-lg">
            <button
              onClick={() => setActiveTab('encode')}
              className={cn(
                "px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2",
                activeTab === 'encode' 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <LockKeyhole className="w-4 h-4" />
              ENCODE
            </button>
            <button
              onClick={() => setActiveTab('decode')}
              className={cn(
                "px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2",
                activeTab === 'decode' 
                  ? "bg-secondary text-secondary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <UnlockKeyhole className="w-4 h-4" />
              DECODE
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'encode' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'encode' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'encode' ? <EncodeSection /> : <DecodeSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
