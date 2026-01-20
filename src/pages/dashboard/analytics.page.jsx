import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { 
  useGetSolarUnitForUserQuery, 
  useGetEnergyGenerationRecordsBySolarUnitQuery,
  useGetCapacityFactorQuery,
  useGetPeakHoursQuery
} from "@/lib/redux/query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChartSpline, 
  TrendingUp, 
  TrendingDown,
  Zap, 
  Sun, 
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";
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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AnalyticsPage = () => {
  const { user, isLoaded } = useUser();
  const [timeRange, setTimeRange] = useState(30); // days

  // Fetch solar unit
  const { data: solarUnit, isLoading: isLoadingSolarUnit } = useGetSolarUnitForUserQuery();

  // Fetch energy records
  const { data: energyRecords, isLoading: isLoadingRecords } = useGetEnergyGenerationRecordsBySolarUnitQuery(
    { 
      id: solarUnit?._id,
      groupBy: 'daily',
      limit: timeRange
    },
    { skip: !solarUnit }
  );

  // Fetch capacity factor
  const { data: capacityData, isLoading: isLoadingCapacity } = useGetCapacityFactorQuery(
    { solarUnitId: solarUnit?._id, days: timeRange },
    { skip: !solarUnit }
  );

  // Fetch peak hours
  const { data: peakHoursData, isLoading: isLoadingPeakHours } = useGetPeakHoursQuery(
    { solarUnitId: solarUnit?._id, days: timeRange },
    { skip: !solarUnit }
  );

  if (!isLoaded || isLoadingSolarUnit) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!solarUnit) {
    return (
      <Card className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <p className="text-yellow-700 dark:text-yellow-300">No solar unit found for your account.</p>
      </Card>
    );
  }

  const isLoading = isLoadingRecords || isLoadingCapacity || isLoadingPeakHours;

  // Calculate statistics
  const calculateStats = () => {
    if (!energyRecords || energyRecords.length === 0) {
      return {
        totalEnergy: 0,
        avgDaily: 0,
        maxDaily: 0,
        minDaily: 0,
        trend: 0
      };
    }

    const total = energyRecords.reduce((sum, record) => sum + (record.totalEnergy || 0), 0);
    const avg = total / energyRecords.length;
    const max = Math.max(...energyRecords.map(r => r.totalEnergy || 0));
    const min = Math.min(...energyRecords.map(r => r.totalEnergy || 0));

    // Calculate trend (last 7 days vs previous 7 days)
    const recentRecords = energyRecords.slice(0, Math.min(7, energyRecords.length));
    const previousRecords = energyRecords.slice(7, Math.min(14, energyRecords.length));
    
    const recentAvg = recentRecords.length > 0 
      ? recentRecords.reduce((sum, r) => sum + (r.totalEnergy || 0), 0) / recentRecords.length 
      : 0;
    const previousAvg = previousRecords.length > 0 
      ? previousRecords.reduce((sum, r) => sum + (r.totalEnergy || 0), 0) / previousRecords.length 
      : 0;
    
    const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    return { totalEnergy: total, avgDaily: avg, maxDaily: max, minDaily: min, trend };
  };

  const stats = calculateStats();

  // Prepare chart data
  const chartData = energyRecords
    ? energyRecords
        .slice()
        .reverse()
        .map((record) => ({
          date: new Date(record._id || record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          energy: parseFloat((record.totalEnergy || 0).toFixed(2)),
          capacity: capacityData?.dailyData?.find(d => 
            new Date(d.date).toDateString() === new Date(record._id || record.date).toDateString()
          )?.capacityFactor || 0
        }))
    : [];

  // Prepare hourly distribution data
  const hourlyDistribution = peakHoursData?.hourlyDistribution || [];
  const pieData = [
    { name: 'Morning (6-10 AM)', value: 0, color: '#FCD34D' },
    { name: 'Midday (10-14 PM)', value: 0, color: '#F59E0B' },
    { name: 'Afternoon (14-18 PM)', value: 0, color: '#EF4444' },
    { name: 'Evening (18-20 PM)', value: 0, color: '#8B5CF6' }
  ];

  hourlyDistribution.forEach(item => {
    const hour = item._id;
    if (hour >= 6 && hour < 10) pieData[0].value += item.totalEnergy;
    else if (hour >= 10 && hour < 14) pieData[1].value += item.totalEnergy;
    else if (hour >= 14 && hour < 18) pieData[2].value += item.totalEnergy;
    else if (hour >= 18 && hour < 20) pieData[3].value += item.totalEnergy;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <ChartSpline className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">Comprehensive energy generation insights</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === days
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Energy</p>
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {stats.totalEnergy.toFixed(2)} kWh
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Last {timeRange} days</p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Daily Average</p>
                <Sun className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                {stats.avgDaily.toFixed(2)} kWh
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <p className={`text-xs font-medium ${stats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.trend).toFixed(1)}% vs prev period
                </p>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">Peak Day</p>
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                {stats.maxDaily.toFixed(2)} kWh
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Maximum daily output</p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Avg Capacity</p>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                {capacityData?.averageCapacityFactor?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">System efficiency</p>
            </Card>
          </div>

          {/* Energy Generation Trend */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Energy Generation Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorEnergy)"
                  name="Energy (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Capacity Factor & Hourly Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Capacity Factor Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Capacity Factor Analysis
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="capacity" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Capacity Factor (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Capacity Factor:</strong> Ratio of actual energy production to maximum possible production. 
                  Higher values indicate better system performance.
                </p>
              </div>
            </Card>

            {/* Hourly Distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Daily Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Energy generation distribution throughout the day. Peak production typically occurs during midday hours.
                </p>
              </div>
            </Card>
          </div>

          {/* Peak Hours Bar Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Hourly Production Pattern
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEnergy" fill="#F59E0B" name="Energy Production (kWh)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">Morning</p>
                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-300">
                  {pieData[0].value.toFixed(1)} kWh
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">Midday</p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-300">
                  {pieData[1].value.toFixed(1)} kWh
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-400 font-medium">Afternoon</p>
                <p className="text-lg font-bold text-red-900 dark:text-red-300">
                  {pieData[2].value.toFixed(1)} kWh
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">Evening</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                  {pieData[3].value.toFixed(1)} kWh
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
