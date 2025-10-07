import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ProjectTaskMonthlyStats = ({ months, statsFetching }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(months?.series, statusColorMapping);
    }, [months?.series]);

    // Transform ApexChart data format to Recharts format
    const chartData = useMemo(() => {
        if (!months?.categories || !months?.series) return [];

        return months.categories.map((category, index) => {
            const dataPoint = { month: category };
            months.series.forEach((series) => {
                dataPoint[series.name] = series.data[index] || 0;
            });
            return dataPoint;
        });
    }, [months]);

    // Generate gradient definitions for each series
    const gradients = useMemo(() => {
        if (!months?.series) return [];
        return months.series.map((series, index) => ({
            id: `gradient-${series.name.replace(/\s+/g, '-')}`,
            color: colors[index] || '#3B82F6'
        }));
    }, [months?.series, colors]);

    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box">
                <div className="box-body !p-0">
                    {statsFetching ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="p-6 pb-2">
                            <p className="text-[.9375rem] font-semibold">
                                Tasks Statistics
                                <span className="text-muted font-normal"> (Last 6 months) :</span>
                            </p>
                            <div id="task-list-stats" className="mt-4">
                                <ResponsiveContainer width="100%" height={500}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            {gradients.map((gradient) => (
                                                <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={gradient.color} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={gradient.color} stopOpacity={0} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#6B7280"
                                            fontSize={12}
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <YAxis
                                            stroke="#6B7280"
                                            fontSize={12}
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                padding: '8px 12px'
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '20px' }}
                                            iconType="rect"
                                        />
                                        {months?.series?.map((series, index) => (
                                            <Area
                                                key={series.name}
                                                type="monotone"
                                                dataKey={series.name}
                                                stroke={colors[index] || '#3B82F6'}
                                                fillOpacity={1}
                                                fill={`url(#gradient-${series.name.replace(/\s+/g, '-')})`}
                                                name={series.name}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectTaskMonthlyStats;