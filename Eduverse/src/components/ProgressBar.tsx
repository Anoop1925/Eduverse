import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  size = 'md', 
  showPercentage = false,
  className = ''
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const percentageClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-gray-600 font-medium ${percentageClasses[size]}`}>
          Progress
        </span>
        {showPercentage && (
          <span className={`text-gray-600 font-medium ${percentageClasses[size]}`}>
            {clampedProgress}%
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            clampedProgress === 100 
              ? 'bg-green-500' 
              : clampedProgress >= 50 
                ? 'bg-blue-500' 
                : 'bg-yellow-500'
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
} 