import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Star,
    Percent
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: React.ElementType;
    color: string;
    index: number;
}

const MetricCard = ({ title, value, change, changeLabel, icon: Icon, color, index }: MetricCardProps) => {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground font-medium">{title}</p>
                            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                            {change !== undefined && (
                                <div className="flex items-center gap-1 mt-2">
                                    {isPositive && <TrendingUp className="h-4 w-4 text-green-500" />}
                                    {isNegative && <TrendingDown className="h-4 w-4 text-red-500" />}
                                    <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                        {isPositive && '+'}{change}%
                                    </span>
                                    {changeLabel && (
                                        <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

interface PerformanceMetricsProps {
    conversionRate?: number;
    avgBookingValue?: number;
    customerSatisfaction?: number;
    revenuePerTrip?: number;
}

export const PerformanceMetrics = ({
    conversionRate = 12.5,
    avgBookingValue = 45000,
    customerSatisfaction = 4.8,
    revenuePerTrip = 180000,
}: PerformanceMetricsProps) => {
    const metrics = [
        {
            title: 'Conversion Rate',
            value: `${conversionRate}%`,
            change: 2.5,
            changeLabel: 'vs last month',
            icon: Target,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Avg Booking Value',
            value: `₹${avgBookingValue.toLocaleString()}`,
            change: 8.3,
            changeLabel: 'vs last month',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Customer Satisfaction',
            value: customerSatisfaction.toFixed(1),
            change: 0.3,
            changeLabel: 'rating increase',
            icon: Star,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            title: 'Revenue Per Trip',
            value: `₹${(revenuePerTrip / 1000).toFixed(0)}K`,
            change: 15.2,
            changeLabel: 'vs last month',
            icon: Percent,
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
                <MetricCard key={metric.title} {...metric} index={index} />
            ))}
        </div>
    );
};
