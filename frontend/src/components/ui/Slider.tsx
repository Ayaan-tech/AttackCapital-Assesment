import React from 'react';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}

export function Slider({ label, value, onChange, min, max, step, className = '' }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
          {value}
        </span>
      </div>
    </div>
  );
}