import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'critical' | 'warning' | 'stable' | 'monitoring';
  text?: string;
  className?: string;
}

const statusConfig = {
  critical: {
    bg: 'bg-status-critical/10',
    text: 'text-status-critical',
    defaultText: 'Kritický',
  },
  warning: {
    bg: 'bg-status-warning/10',
    text: 'text-status-warning',
    defaultText: 'Varování',
  },
  stable: {
    bg: 'bg-status-stable/10',
    text: 'text-status-stable',
    defaultText: 'Stabilní',
  },
  monitoring: {
    bg: 'bg-status-monitoring/10',
    text: 'text-status-monitoring',
    defaultText: 'Monitorování',
  },
};

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          config.text.replace('text', 'bg')
        )}
      />
      {text || config.defaultText}
    </span>
  );
}
