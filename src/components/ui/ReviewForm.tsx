'use client';

import React, { useState } from 'react';
import { X, Star as StarIcon } from 'lucide-react';
import { db } from '@/lib/data/mock-db';
import { Review } from '@/types';

interface ReviewFormProps {
  requestId: string;
  carrierId: string;
  carrierName: string;
  customerId: string;
  customerName: string;
  originCity: string;
  destinationCity: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface StarRatingProps {
  value: number;
  onChange: (val: number) => void;
  size?: 'sm' | 'lg';
}

function StarRating({ value, onChange, size = 'sm' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === 'lg' ? 'w-9 h-9' : 'w-5 h-5';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <svg
              className={starSize}
              viewBox="0 0 24 24"
              fill={filled ? '#F95700' : 'none'}
              stroke={filled ? '#F95700' : '#cbd5e1'}
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

const SUB_RATINGS = [
  { key: 'communicationRating', label: 'İletişim' },
  { key: 'punctualityRating', label: 'Dakiklik' },
  { key: 'serviceQualityRating', label: 'Hizmet Kalitesi' },
  { key: 'priceHonestyRating', label: 'Fiyat Dürüstlüğü' },
] as const;

type SubRatingKey = typeof SUB_RATINGS[number]['key'];

export function ReviewForm({
  requestId,
  carrierId,
  carrierName,
  customerId,
  customerName,
  originCity,
  destinationCity,
  onSuccess,
  onClose,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [subRatings, setSubRatings] = useState<Record<SubRatingKey, number>>({
    communicationRating: 0,
    punctualityRating: 0,
    serviceQualityRating: 0,
    priceHonestyRating: 0,
  });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubRating = (key: SubRatingKey, val: number) => {
    setSubRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Lütfen genel bir puan seçin.');
      return;
    }
    if (comment.trim().length < 20) {
      setError('Yorumunuz en az 20 karakter olmalıdır.');
      return;
    }
    setError('');
    setSubmitting(true);

    const review: Review = {
      id: `rev_${Date.now()}`,
      requestId,
      carrierId,
      customerId,
      customerName,
      originCity,
      destinationCity,
      rating,
      communicationRating: subRatings.communicationRating || rating,
      punctualityRating: subRatings.punctualityRating || rating,
      serviceQualityRating: subRatings.serviceQualityRating || rating,
      priceHonestyRating: subRatings.priceHonestyRating || rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      db.addReviewAndUpdateCarrier(review);
      onSuccess();
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A1128]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-[#0A1128]">Taşıma Değerlendirmesi</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{carrierName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Route info */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-700">{originCity}</span>
            <span>→</span>
            <span className="px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-700">{destinationCity}</span>
            <span className="ml-1">taşınması</span>
          </div>

          {/* Overall Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-[#0A1128]">
              Genel Puan <span className="text-[#F95700]">*</span>
            </label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="text-xs text-slate-500 font-medium">
                {rating === 5 ? 'Mükemmel!' : rating === 4 ? 'Çok İyi' : rating === 3 ? 'Orta' : rating === 2 ? 'Kötü' : 'Çok Kötü'}
              </p>
            )}
          </div>

          {/* Sub Ratings */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-black text-[#0A1128] uppercase tracking-wider">Detaylı Değerlendirme</p>
            {SUB_RATINGS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-600 min-w-[120px]">{label}</span>
                <StarRating value={subRatings[key]} onChange={(val) => handleSubRating(key, val)} size="sm" />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-[#0A1128]">
              Yorumunuz <span className="text-[#F95700]">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Taşıma deneyiminizi anlatın... (en az 20 karakter)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F95700]/30 focus:border-[#F95700] resize-none transition-colors"
            />
            <div className="flex justify-between items-center">
              <p className={`text-xs font-medium ${comment.length < 20 ? 'text-slate-400' : 'text-emerald-600'}`}>
                {comment.length} / 20+ karakter
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-white bg-[#F95700] hover:bg-[#e04f00] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md shadow-orange-900/20"
            >
              {submitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
