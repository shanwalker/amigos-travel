import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface AnalyticsChartProps {
    title: string;
    data: any[];
    type?: 'line' | 'bar' | 'area';
    dataKey: string;
    xAxisKey: string;
    color?: string;
    height?: number;
}

export const AnalyticsChart = ({
    title,
    data,
    type = 'line',
    dataKey,
    xAxisKey,
    color = '#FFB400',
    height = 300,
}: AnalyticsChartProps) => {
    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 5, right: 30, left: 20, bottom: 5 },
        };

        switch (type) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 37, 64, 0.9)',
                                border: '1px rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 37, 64, 0.9)',
                                border: '1px rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fillOpacity={1}
                            fill="url(#colorGradient)"
                        />
                    </AreaChart>
                );

            default: // line
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 37, 64, 0.9)',
                                border: '1px rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                );
        }
    };

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <CardTitle className="text-foreground text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    {renderChart()}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
