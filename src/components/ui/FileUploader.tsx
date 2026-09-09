'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Camera, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { storage, isFirebaseConfigured } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface FileUploaderProps {
  label?: string;
  description?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  files: string[];
  onChange: (files: string[]) => void;
  accept?: string;
  mode?: 'photos' | 'document';
}

/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Reduces 4-5MB camera photos down to ~80-150KB while preserving visual clarity.
 */
async function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.75
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    // Non-image files (e.g. PDF documents)
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result as string, blob: file });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: e.target?.result as string, blob: file });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob });
            } else {
              resolve({ dataUrl, blob: file });
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        // Fallback to raw dataURL if canvas decode fails
        resolve({ dataUrl: e.target?.result as string, blob: file });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  maxFiles = 5,
  maxSizeMB = 5,
  files,
  onChange,
  accept = 'image/*',
  mode = 'photos'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    setErrorMessage(null);
    setIsUploading(true);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < uploaded.length; i++) {
        if (files.length + newUrls.length >= maxFiles) break;

        const file = uploaded[i];

        // 1. Check maximum file size (5 MB limit)
        if (file.size > maxSizeBytes) {
          setErrorMessage(
            `"${file.name}" dosyası ${(file.size / (1024 * 1024)).toFixed(1)} MB boyutunda. Görsel boyutu en fazla ${maxSizeMB} MB olabilir.`
          );
          continue;
        }

        // 2. Client-side auto-compression to avoid bloating database & network
        const { dataUrl, blob } = await compressImage(file);

        let finalUrl = dataUrl;

        // 3. Try Firebase Storage if configured
        if (isFirebaseConfigured() && storage) {
          try {
            const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, blob);
            finalUrl = await getDownloadURL(storageRef);
          } catch (storageErr) {
            console.warn('Firebase Storage upload failed, using compressed Data URL:', storageErr);
            finalUrl = dataUrl;
          }
        }

        newUrls.push(finalUrl);
      }

      if (newUrls.length > 0) {
        onChange([...files, ...newUrls]);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setErrorMessage(err?.message || 'Dosya yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">{label}</label>
          <span className="text-xs text-slate-500 font-semibold">
            {files.length} / {maxFiles} dosya (Maks. {maxSizeMB} MB)
          </span>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {files.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#F95700] bg-slate-50/50 hover:bg-orange-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : mode === 'photos' ? (
              <Camera className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isUploading 
                ? 'Görsel optimize ediliyor ve yükleniyor...' 
                : (mode === 'photos' ? 'Fotoğraf Seç veya Kameradan Çek' : 'Belge Yükle')}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {description || `JPG, PNG veya WEBP • Maksimum ${maxSizeMB} MB (Otomatik Optimize Edilir)`}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}

      {/* Uploaded File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {files.map((fileUrl, idx) => (
            <div 
              key={idx} 
              className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video sm:aspect-square bg-slate-100 flex items-center justify-center shadow-xs"
            >
              {mode === 'photos' ? (
                <img
                  src={fileUrl}
                  alt={`Yüklenen ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 p-2 text-center">
                  <FileText className="w-8 h-8 text-[#F95700]" />
                  <span className="text-[11px] font-bold text-slate-700 truncate max-w-[100px]">Belge {idx + 1}</span>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                aria-label="Sil"
                title="Fotoğrafı Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] rounded-md font-bold flex items-center gap-1 shadow-xs">
                <Check className="w-3 h-3" /> Hazır
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

