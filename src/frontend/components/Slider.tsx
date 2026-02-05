import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  trackColor?: string;
  thumbColor?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  valueFormatter,
  trackColor = '#3b82f6', // blue-500
  thumbColor = '#3b82f6', // blue-500
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPercentage = x / rect.width;
    let newValue = min + newPercentage * (max - min);

    // Snap to step
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));

    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const displayValue = valueFormatter ? valueFormatter(value) : value;

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="block text-sm font-medium text-gray-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-blue-400 px-2.5 py-0.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30 transition-all duration-200 hover:border-gray-600/50">
        <div
          ref={sliderRef}
          className="relative h-2 cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Track Background */}
          <div className="absolute inset-0 bg-gray-700/50 rounded-full overflow-hidden">
            {/* Active Track */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${trackColor} 0%, ${trackColor}dd 100%)`,
                boxShadow: `0 0 12px ${trackColor}40`,
              }}
            />
          </div>

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200 ease-out"
            style={{
              left: `${percentage}%`,
              transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : isHovering ? 1.1 : 1})`,
            }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full blur-sm transition-opacity duration-200"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: thumbColor,
                opacity: isDragging || isHovering ? 0.35 : 0.15,
              }}
            />

            {/* Outer ring for depth */}
            <div
              className="absolute inset-0 w-6 h-6 rounded-full transition-all duration-200"
              style={{
                background: `radial-gradient(circle at center, transparent 60%, ${thumbColor}30 60%, ${thumbColor}20 100%)`,
                opacity: isDragging || isHovering ? 1 : 0,
                transform: 'translate(-50%, -50%) scale(1.1)',
                top: '50%',
                left: '50%',
              }}
            />

            {/* Main thumb container */}
            <div className="relative">
              {/* Thumb circle with gradient */}
              <div
                className="relative w-5 h-5 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${thumbColor}f8 0%, ${thumbColor}dd 50%, ${thumbColor}c8 100%)`,
                  boxShadow: `
                    0 2px 4px rgba(0, 0, 0, 0.2),
                    0 1px 2px rgba(0, 0, 0, 0.15),
                    inset 0 1px 1px rgba(255, 255, 255, 0.22),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.18)
                  `,
                }}
              >
                {/* Top highlight */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 55%)',
                  }}
                />

                {/* Center dot for better grip indication */}
                <div
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.32)',
                    boxShadow: '0 0 2px rgba(0, 0, 0, 0.25)',
                    opacity: isDragging || isHovering ? 0.9 : 0.6,
                  }}
                />

                {/* Border overlay */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-200"
                  style={{
                    border: `1.5px solid ${isDragging ? 'rgba(255, 255, 255, 0.7)' : isHovering ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.35)'}`,
                    boxShadow: isDragging || isHovering ? '0 0 7px rgba(255, 255, 255, 0.22)' : 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Step markers (optional, for discrete steps) */}
          {step > (max - min) / 20 && (
            <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
              {Array.from({ length: Math.floor((max - min) / step) + 1 }).map((_, i) => {
                const stepPercentage = (i * step / (max - min)) * 100;
                return (
                  <div
                    key={i}
                    className="w-0.5 h-1 bg-gray-600 rounded-full"
                    style={{
                      position: 'absolute',
                      left: `${stepPercentage}%`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
