"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisionUploadProps {
  onExtract: (data: any) => void;
}

export function VisionUpload({ onExtract }: VisionUploadProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsExtracting(true);

    try {
      const reader = new FileReader();

      const base64data = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      const response = await fetch(`${baseUrl}/api/vision/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64data }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract data. Is the AI Service reachable?");
      }

      const data = await response.json();
      onExtract(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during extraction.");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col space-y-2 col-span-2 lg:col-span-4 mb-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-24 border-dashed border-2 bg-zinc-950/50 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white transition-all flex flex-col items-center justify-center gap-2 rounded-xl"
        onClick={() => fileInputRef.current?.click()}
        disabled={isExtracting}
      >
        {isExtracting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="font-medium text-sm">Analyzing Image via Sarvam AI...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-6 h-6" />
            <span className="font-medium text-sm">Upload Treadmill/Watch Photo (Auto-Extract)</span>
          </>
        )}
      </Button>
      {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}
    </div>
  );
}
