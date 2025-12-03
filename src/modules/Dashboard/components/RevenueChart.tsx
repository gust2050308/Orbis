'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyRevenue } from "../types/dashboard";

interface RevenueChartProps {
    data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium text-[#102542]">{payload[0].payload.month}</p>
                    <p className="text-green-600 font-bold">
                        ${payload[0].value.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#102542]">
                    Ingresos Mensuales
                </CardTitle>
                <p className="text-sm text-muted-foreground">Últimos 4 meses</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="month"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
