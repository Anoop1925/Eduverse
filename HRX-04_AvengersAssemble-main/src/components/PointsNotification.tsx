import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

interface PointsNotificationProps {
  points: number;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function PointsNotification({
  points,
  message,
  isVisible,
  onClose,
  autoHide = true,
  autoHideDelay = 3000
}: PointsNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          onClose();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, autoHide, autoHideDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ${
          isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900">
                +{points} Points!
              </span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Earned
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 