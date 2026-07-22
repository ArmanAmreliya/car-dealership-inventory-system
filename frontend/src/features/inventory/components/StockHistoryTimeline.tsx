/**
 * StockHistoryTimeline Component
 *
 * Timeline showing stock movements and restock history.
 * Inventory analytics with visual timeline.
 */

import { Clock, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';

interface StockMovement {
  id: string;
  type: 'restock' | 'sale' | 'adjustment' | 'damage' | 'return';
  quantity: number;
  previousQuantity: number;
  reason: string;
  timestamp: Date;
  userId?: string;
}

interface StockHistoryTimelineProps {
  movements: StockMovement[];
}

const MOVEMENT_CONFIG = {
  restock: {
    icon: ArrowUp,
    color: 'text-status-success',
    bgColor: 'bg-status-success/10',
    borderColor: 'border-status-success/20',
  },
  sale: {
    icon: ArrowDown,
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-200',
  },
  adjustment: {
    icon: AlertCircle,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
    borderColor: 'border-status-warning/20',
  },
  damage: {
    icon: AlertCircle,
    color: 'text-status-error',
    bgColor: 'bg-status-error/10',
    borderColor: 'border-status-error/20',
  },
  return: {
    icon: ArrowUp,
    color: 'text-status-info',
    bgColor: 'bg-status-info/10',
    borderColor: 'border-status-info/20',
  },
} as const;

export function StockHistoryTimeline({ movements }: StockHistoryTimelineProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (movements.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
        <p className="text-sm text-neutral-500">No stock movements recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Stock History</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />

        {/* Movements */}
        <div className="space-y-4">
          {movements.map((movement) => {
            const config = MOVEMENT_CONFIG[movement.type];
            const Icon = config.icon;
            const quantityChange = movement.quantity - movement.previousQuantity;
            const isIncrease = quantityChange > 0;

            return (
              <div key={movement.id} className="relative pl-10">
                {/* Timeline Dot */}
                <div className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 ${config.bgColor} ${config.borderColor}`} />

                {/* Movement Card */}
                <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 capitalize">
                          {movement.type}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {movement.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isIncrease ? 'text-status-success' : 'text-status-error'}`}>
                        {isIncrease ? '+' : ''}{quantityChange}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {formatDate(movement.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Details */}
                  <div className="mt-3 pt-3 border-t border-neutral-200/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Previous: {movement.previousQuantity}</span>
                      <span className="text-neutral-500">Current: {movement.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
