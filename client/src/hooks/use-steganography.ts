import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import CryptoJS from "crypto-js";

// LSB Steganography Constants
const DELIMITER = "|||EOF|||";

export interface SteganoHistoryItem {
  id: string;
  timestamp: number;
  action: 'encode' | 'decode';
  filename: string;
}

export function useSteganography() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<SteganoHistoryItem[]>(() => {
    const saved = localStorage.getItem('stegano_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (action: 'encode' | 'decode', filename: string) => {
    const newItem: SteganoHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      filename
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('stegano_history', JSON.stringify(updated));
  };

  // Helper: Convert string to binary
  const textToBinary = (text: string): string => {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  };

  // Helper: Convert binary to string
  const binaryToText = (binary: string): string => {
    const bytes = binary.match(/.{1,8}/g) || [];
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const calculateCapacity = (imgWidth: number, imgHeight: number): number => {
    // 3 bits per pixel (RGB LSBs)
    return Math.floor((imgWidth * imgHeight * 3) / 8);
  };

  // ENCODE: Hide text in image
  const encodeMessage = useCallback(async (file: File, message: string, password?: string): Promise<string | null> => {
    setIsProcessing(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            toast({ variant: "destructive", title: "Error", description: "Could not initialize canvas" });
            setIsProcessing(false);
            resolve(null);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Encrypt if password provided
          let processedMessage = message;
          if (password) {
            processedMessage = "ENC:" + CryptoJS.AES.encrypt(message, password).toString();
          }
          
          const fullMessage = processedMessage + DELIMITER;
          const binaryMessage = textToBinary(fullMessage);
          
          const capacityBits = (data.length / 4) * 3;
          if (binaryMessage.length > capacityBits) {
             toast({ 
               variant: "destructive", 
               title: "Message too long", 
               description: `Requires ${Math.ceil(binaryMessage.length/8)} bytes, capacity is ${Math.floor(capacityBits/8)} bytes.` 
             });
             setIsProcessing(false);
             resolve(null);
             return;
          }

          let binaryIndex = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (binaryIndex >= binaryMessage.length) break;
            for (let j = 0; j < 3; j++) {
              if (binaryIndex < binaryMessage.length) {
                data[i+j] = (data[i+j] & 0xFE) | parseInt(binaryMessage[binaryIndex]);
                binaryIndex++;
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const encodedUrl = canvas.toDataURL('image/png');
          addToHistory('encode', file.name);
          setIsProcessing(false);
          resolve(encodedUrl);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [toast, history]);

  // DECODE: Reveal text from image
  const decodeMessage = useCallback(async (file: File | string, password?: string): Promise<string | null> => {
    setIsProcessing(true);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let binaryMessage = "";
        
        for (let i = 0; i < data.length; i += 4) {
          for (let j = 0; j < 3; j++) {
            binaryMessage += (data[i+j] & 1);
          }
        }

        const fullText = binaryToText(binaryMessage);
        if (fullText.includes(DELIMITER)) {
          let secret = fullText.split(DELIMITER)[0];
          
          if (secret.startsWith("ENC:")) {
            if (!password) {
              toast({ variant: "destructive", title: "Password Required", description: "This message is encrypted." });
              setIsProcessing(false);
              resolve(null);
              return;
            }
            try {
              const bytes = CryptoJS.AES.decrypt(secret.substring(4), password);
              const decrypted = bytes.toString(CryptoJS.enc.Utf8);
              if (!decrypted) throw new Error();
              secret = decrypted;
            } catch (e) {
              toast({ variant: "destructive", title: "Decryption Failed", description: "Invalid password." });
              setIsProcessing(false);
              resolve(null);
              return;
            }
          }

          const cleanSecret = secret.replace(/[^\x20-\x7E\n\r\t]/g, "");
          addToHistory('decode', typeof file === 'string' ? 'remote-image.png' : file.name);
          setIsProcessing(false);
          resolve(cleanSecret);
        } else {
          toast({ variant: "destructive", title: "No message found" });
          setIsProcessing(false);
          resolve(null);
        }
      };
      
      if (typeof file === 'string') img.src = file;
      else {
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target?.result as string;
        reader.readAsDataURL(file);
      }
    });
  }, [toast, history]);

  return { encodeMessage, decodeMessage, isProcessing, history, calculateCapacity };
}
