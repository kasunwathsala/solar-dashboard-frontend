import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPeakHoursQuery } from "@/lib/redux/query";
import { Clock, Sun, AlertCircle } from "lucide-react";
import { useState } from "react";

const PeakHourDistribution = ({ solarUnitId, days = 30 }) => {
  const { data, isLoading, isError } = useGetPeakHoursQuery({ solarUnitId, days });
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <Skeleton className="h-7 w-64 mb-6" />
        <div className="flex justify-between gap-6">
          <Skeleton className="h-80 w-1/2" />
          <Skeleton className="h-80 w-1/2" />
        </div>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 font-semibold">Unable to load peak hour data.</p>
        </div>
      </Card>
    );
  }

  // Colors for pie chart
  const COLORS = {
    morning: "#10b981",   // Green
    midday: "#f59e0b",    // Orange/Yellow
    afternoon: "#3b82f6", // Blue
    other: "#6b7280",     // Gray
  };

  const pieColors = [
    COLORS.morning,
    COLORS.midday,
    COLORS.afternoon,
    COLORS.other,
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-foreground mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-primary">
              <strong>Energy:</strong> {data.value} kWh
            </p>
            <p className="text-muted-foreground">
              <strong>Percentage:</strong> {data.payload.percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Active shape for pie chart (makes it interactive)
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-orange-50/20 to-blue-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/10 dark:from-orange-400/30 dark:to-orange-600/20">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Peak Hour Distribution</h3>
            <p className="text-sm text-muted-foreground">Energy generation by time of day - Last {days} Days</p>
          </div>
        </div>

        {/* Peak Hours Summary */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="font-semibold text-foreground">Top 3 Peak Production Hours</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {data.peakHours.map((hour, index) => (
              <div key={hour.hour} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-2xl font-bold text-primary mb-1">{hour.hourLabel}</p>
                <p className="text-sm text-muted-foreground">{hour.totalEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {index === 0 ? "🥇 Peak" : index === 1 ? "🥈 2nd" : "🥉 3rd"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Distribution by Time Category */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Generation Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data.distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                label={({ name, percentage }) => `${percentage}%`}
                labelLine={false}
              >
                {data.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-sm text-foreground">
                    {value}: {entry.payload.percentage}%
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-md">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Total Energy ({days} days)
            </p>
            <p className="text-4xl font-bold text-foreground mb-2">{data.totalEnergy.toFixed(1)} kWh</p>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-muted-foreground">
                Daily Average: {(data.totalEnergy / days).toFixed(1)} kWh
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Breakdown by Period</p>
            {data.distribution.map((item, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: pieColors[index] }}
                  />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{item.value.toFixed(1)} kWh</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Insight:</strong> Most solar energy is generated during midday (12 PM - 3 PM) when the sun is at its highest angle. 
          Morning and afternoon periods have lower but still significant production.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-muted-foreground text-center">
          💡 Tip: Schedule high-energy activities during peak production hours to maximize solar usage
        </p>
      </div>
    </Card>
  );
};

export default PeakHourDistribution;
