import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCapacityFactorQuery } from "@/lib/redux/query";
import { Activity, TrendingUp, AlertCircle } from "lucide-react";

const CapacityFactorChart = ({ solarUnitId, days = 7 }) => {
  const { data, isLoading, isError } = useGetCapacityFactorQuery({ solarUnitId, days });

  if (isLoading) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <Skeleton className="h-7 w-64 mb-6" />
        <Skeleton className="h-80 w-full" />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 font-semibold">Unable to load capacity factor data.</p>
        </div>
      </Card>
    );
  }

  // Color bars based on capacity factor performance
  const getBarColor = (value) => {
    if (value >= 80) return "#10b981"; // Green - Excellent
    if (value >= 60) return "#3b82f6"; // Blue - Good
    if (value >= 40) return "#f59e0b"; // Orange - Fair
    return "#ef4444"; // Red - Poor
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-foreground mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-primary">
              <strong>Capacity Factor:</strong> {data.capacityFactor}%
            </p>
            <p className="text-muted-foreground">
              <strong>Actual Energy:</strong> {data.actualEnergy} kWh
            </p>
            <p className="text-muted-foreground">
              <strong>Theoretical Max:</strong> {data.theoreticalMax} kWh
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get performance rating based on average
  const getPerformanceRating = (avg) => {
    if (avg >= 80) return { text: "Excellent", color: "text-green-600 dark:text-green-400", icon: "🌟" };
    if (avg >= 60) return { text: "Good", color: "text-blue-600 dark:text-blue-400", icon: "✅" };
    if (avg >= 40) return { text: "Fair", color: "text-orange-600 dark:text-orange-400", icon: "⚠️" };
    return { text: "Needs Attention", color: "text-red-600 dark:text-red-400", icon: "🔴" };
  };

  const performance = getPerformanceRating(data.averageCapacityFactor);

  return (
    <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-green-50/20 to-blue-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Capacity Factor Analysis</h3>
              <p className="text-sm text-muted-foreground">Efficiency vs Rated Capacity - Last {days} Days</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Average Capacity Factor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Average</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{data.averageCapacityFactor}%</p>
            <p className={`text-sm font-semibold mt-1 ${performance.color}`}>
              {performance.icon} {performance.text}
            </p>
          </div>

          {/* Solar Unit Capacity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Rated Capacity</p>
            <p className="text-3xl font-bold text-foreground">{data.capacity} kW</p>
            <p className="text-sm text-muted-foreground mt-1">System Rating</p>
          </div>

          {/* Period */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Analysis Period</p>
            <p className="text-xl font-bold text-foreground">{data.period.days} Days</p>
            <p className="text-xs text-muted-foreground mt-1">{data.period.from} to {data.period.to}</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>What is Capacity Factor?</strong> The ratio of actual energy generated to the theoretical maximum 
            (Capacity × 24 hours). Higher values indicate better system efficiency. Industry average: 15-25% for solar.
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data.dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Capacity Factor (%)', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm font-medium text-foreground">{value}</span>}
          />
          
          {/* Reference line at industry average (20%) */}
          <ReferenceLine 
            y={20} 
            stroke="#9ca3af" 
            strokeDasharray="5 5" 
            label={{ value: 'Industry Avg (20%)', position: 'right', fill: '#6b7280', fontSize: 12 }}
          />
          
          <Bar 
            dataKey="capacityFactor" 
            name="Capacity Factor (%)" 
            radius={[8, 8, 0, 0]}
          >
            {data.dailyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.capacityFactor)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-muted-foreground text-center">
          💡 Tip: Capacity factors above 20% indicate excellent performance for solar installations
        </p>
      </div>
    </Card>
  );
};

export default CapacityFactorChart;
