'use client';

import { cn } from '@/lib/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusProps = () => {
    switch (status.toLowerCase()) {
      case 'en curso':
      case 'activo':
      case 'activa':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          label: status,
        };
      case 'vencido':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          label: status,
        };
      case 'borrador':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          label: status,
        };
      case 'archivado':
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          label: status,
        };
      default:
        return {
          bgColor: 'bg-gray-200',
          textColor: 'text-gray-800',
          label: status,
        };
    }
  };

  const { bgColor, textColor, label } = getStatusProps();

  return (
    <span
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-full px-3 py-1 text-sm font-medium',
        bgColor,
        textColor,
        className
      )}
    >
      {label}
    </span>
  );
}
