import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MedicalStatsProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string | number;
  className?: string;
}

export function MedicalStats({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  className,
}: MedicalStatsProps) {
  return (
    <div className={cn('p-4 bg-white rounded-lg shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className="text-medical-blue">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {value}
          {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
        </p>
        {trend && trendValue && (
          <span
            className={cn(
              'ml-2 text-sm font-medium',
              trend === 'up' && 'text-medical-green',
              trend === 'down' && 'text-medical-red',
              trend === 'stable' && 'text-gray-500'
            )}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'stable' && '→'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
