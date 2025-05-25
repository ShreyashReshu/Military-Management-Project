
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  className?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description,
  className,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "p-4 cursor-default transition-all", 
        onClick && "hover:shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

export default MetricCard;
