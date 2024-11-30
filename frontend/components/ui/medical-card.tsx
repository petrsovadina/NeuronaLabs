import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

interface MedicalCardProps {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  status?: 'critical' | 'warning' | 'stable' | 'monitoring';
  className?: string;
}

export function MedicalCard({
  title,
  description,
  footer,
  children,
  status,
  className,
}: MedicalCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        status && 'border-l-4',
        status === 'critical' && 'border-l-status-critical',
        status === 'warning' && 'border-l-status-warning',
        status === 'stable' && 'border-l-status-stable',
        status === 'monitoring' && 'border-l-status-monitoring',
        className
      )}
    >
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
