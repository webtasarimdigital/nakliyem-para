'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Camera, FileText } from 'lucide-react';
import { Button } from './Button';

export interface FileUploaderProps {
  label?: string;
  description?: string;
  maxFiles?: number;
  files: string[];
  onChange: (files: string[]) => void;
  accept?: string;
  mode?: 'photos' | 'document';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  maxFiles = 5,
  files,
  onChange,
  accept = 'image/*',
  mode = 'photos'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      // Create object URLs or sample preview images
      const newUrls: string[] = [];
      for (let i = 0; i < uploaded.length; i++) {
        if (files.length + newUrls.length < maxFiles) {
          const file = uploaded[i];
          const fakeUrl = URL.createObjectURL(file);
          newUrls.push(fakeUrl);
        }
      }
      onChange([...files, ...newUrls]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 600);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800">{label}</label>
          <span className="text-xs text-slate-500 font-medium">
            {files.length} / {maxFiles} dosya
          </span>
        </div>
      )}

      {/* Upload Dropzone */}
      {files.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#146EF5] bg-slate-50/50 hover:bg-[#EAF3FF]/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#146EF5] flex items-center justify-center">
            {mode === 'photos' ? <Camera className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isUploading ? 'Dosya yükleniyor...' : (mode === 'photos' ? 'Fotoğraf Seç veya Kameradan Çek' : 'Belge Yükle')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {description || 'JPG, PNG veya PDF • Maksimum 10MB'}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="hidden"
            onChange={handleSimulatedUpload}
          />
        </div>
      )}

      {/* Uploaded File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {files.map((fileUrl, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video sm:aspect-square bg-slate-100 flex items-center justify-center">
              {mode === 'photos' ? (
                <img
                  src={fileUrl}
                  alt={`Yüklenen ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 p-2 text-center">
                  <FileText className="w-8 h-8 text-[#146EF5]" />
                  <span className="text-[11px] font-medium text-slate-700 truncate max-w-[100px]">Belge {idx + 1}</span>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-sm"
                aria-label="Sil"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600/90 text-white text-[10px] rounded-md font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Yüklendi
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
