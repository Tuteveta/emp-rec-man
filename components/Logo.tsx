import React from 'react';
import { Building2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
}

export default function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm', subtext: 'text-[10px]' },
    md: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-base', subtext: 'text-xs' },
    lg: { container: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-xl', subtext: 'text-sm' },
  };

  const colors = {
    default: {
      gradient: 'from-blue-600 to-indigo-600',
      text: 'text-gray-900',
      subtext: 'text-gray-500',
    },
    white: {
      gradient: 'from-white to-gray-100',
      text: 'text-white',
      subtext: 'text-gray-200',
    },
  };

  const currentSize = sizes[size];
  const currentColors = colors[variant];

  return (
    <div className="flex items-center gap-3">
      <div className={`bg-gradient-to-br ${currentColors.gradient} ${currentSize.container} p-2 rounded-lg shadow-md flex items-center justify-center`}>
        <Building2 className={`${currentSize.icon} ${variant === 'white' ? 'text-blue-600' : 'text-white'}`} />
      </div>
      {showText && (
        <div>
          <div className={`${currentSize.text} font-bold ${currentColors.text} tracking-tight`}>
            DICT PNG
          </div>
          <div className={`${currentSize.subtext} ${currentColors.subtext} font-medium`}>
            Employee Management
          </div>
        </div>
      )}
    </div>
  );
}