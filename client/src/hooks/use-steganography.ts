import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// LSB Steganography Constants
const DELIMITER = "|||EOF|||";

export function useSteganography() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

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

  // ENCODE: Hide text in image
  const encodeMessage = useCallback(async (file: File, message: string): Promise<string | null> => {
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
          
          // Prepare message with delimiter
          const fullMessage = message + DELIMITER;
          const binaryMessage = textToBinary(fullMessage);
          
          // Check capacity
          // Each pixel has 4 channels (RGBA), we use RGB (3 bits per pixel)
          const capacity = (data.length / 4) * 3;
          if (binaryMessage.length > capacity) {
             toast({ 
               variant: "destructive", 
               title: "Message too long", 
               description: `Message requires ${binaryMessage.length} bits, but image only holds ${capacity} bits.` 
             });
             setIsProcessing(false);
             resolve(null);
             return;
          }

          let binaryIndex = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (binaryIndex >= binaryMessage.length) break;

            // Modify R, G, B channels
            for (let j = 0; j < 3; j++) {
              if (binaryIndex < binaryMessage.length) {
                // Clear LSB and set to message bit
                // data[i+j] & 0xFE clears the last bit (e.g. 101 -> 100)
                // parseInt(...) adds the new bit (0 or 1)
                data[i+j] = (data[i+j] & 0xFE) | parseInt(binaryMessage[binaryIndex]);
                binaryIndex++;
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const encodedUrl = canvas.toDataURL('image/png');
          setIsProcessing(false);
          resolve(encodedUrl);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [toast]);

  // DECODE: Reveal text from image
  const decodeMessage = useCallback(async (file: File | string): Promise<string | null> => {
    setIsProcessing(true);
    return new Promise((resolve) => {
      const img = new Image();
      // Enable CORS for external images if using URL
      img.crossOrigin = "Anonymous";
      
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
        
        let binaryMessage = "";
        
        // Extract bits
        for (let i = 0; i < data.length; i += 4) {
          for (let j = 0; j < 3; j++) { // R, G, B
            const bit = data[i+j] & 1;
            binaryMessage += bit;
          }
        }

        const fullText = binaryToText(binaryMessage);
        
        if (fullText.includes(DELIMITER)) {
          const secret = fullText.split(DELIMITER)[0];
          // Filter out non-printable chars just in case
          const cleanSecret = secret.replace(/[^\x20-\x7E\n\r\t]/g, "");
          setIsProcessing(false);
          resolve(cleanSecret);
        } else {
          toast({ 
            variant: "destructive", 
            title: "No message found", 
            description: "Could not find a hidden message in this image." 
          });
          setIsProcessing(false);
          resolve(null);
        }
      };
      
      img.onerror = () => {
         toast({ variant: "destructive", title: "Error", description: "Failed to load image" });
         setIsProcessing(false);
         resolve(null);
      };

      if (typeof file === 'string') {
        img.src = file;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }, [toast]);

  return { encodeMessage, decodeMessage, isProcessing };
}
