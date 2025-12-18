import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, toDate } from "date-fns";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";
import { useDispatch } from "react-redux";
import { api } from "@/lib/redux/query";

const DataChart = ({ solarUnitId }) => {
  const dispatch = useDispatch();
  const [selectedRange, setSelectedRange] = useState("7");

  const { data, isLoading, isError, error, refetch } = useGetEnergyGenerationRecordsBySolarUnitQuery({
    id: solarUnitId,
    groupBy: "daily",
    limit: selectedRange,
  });

  const handleRangeChange = async (range) => {
    console.log("📅 Range changed from", selectedRange, "to", range);
    
    // Reset query cache for this specific endpoint
    dispatch(api.util.resetApiState());
    
    setSelectedRange(range);
    
    console.log("🔄 Cache reset, new range will be:", range);
  };

  if (isLoading) {
    return (
      <Card className="rounded-md p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (isError) {
    console.error("❌ DataChart API Error:", error);
    return (
      <Card className="rounded-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Energy Generation Chart - Error Loading Data
        </h2>
        <div className="text-red-500 text-center py-8">
          <p className="mb-2">Unable to load chart data</p>
          <p className="text-sm text-gray-600">
            Error: {error?.data?.message || error?.message || "API connection failed"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Solar Unit ID: {solarUnitId}
          </p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ No chart data available for solar unit:", solarUnitId);
    return (
      <Card className="rounded-md p-4">
        <h2 className="text-lg font-semibold mb-4">
          Energy Generation Chart
        </h2>
        <div className="text-gray-500 text-center py-8">
          <p className="mb-2">No energy generation data available for chart</p>
          <p className="text-sm text-gray-400">
            Solar Unit ID: {solarUnitId}
          </p>
        </div>
      </Card>
    );
  }

  console.log("✅ Chart data received:", data?.length, "records for", selectedRange, "days");
  console.log("📊 Selected range:", selectedRange);

  // Data is already limited by the API call, no need to slice again
  // Filter out undefined values and handle both old and new date formats
  const lastSelectedRangeDaysEnergyProduction = data
    .filter(el => el && (el.date || el._id?.date || el._id))
    .map((el) => {
      const dateString = el.date || el._id?.date || el._id;
      return {
        date: format(toDate(dateString), "MMM d"),
        energy: el.totalEnergy,
      };
    });

  console.log("📈 Chart processed data:", lastSelectedRangeDaysEnergyProduction.length, "data points");

  const chartConfig = {
    energy: {
      label: "Energy (kWh)",
      color: "oklch(54.6% 0.245 262.881)",
    },
  };

  const title = "Energy Production Chart";

  return (
    <Card className="rounded-xl p-6 shadow-lg border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50">
      <div className="flex justify-between items-center gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
          <p className="text-sm text-gray-500">Daily energy output trends</p>
        </div>
        <div>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[180px] border-2 border-blue-200 bg-white hover:border-blue-400 transition-colors">
              <SelectValue
                className="text-foreground font-medium"
                placeholder="Select Range"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">📅 Last 7 Days</SelectItem>
              <SelectItem value="14">📅 Last 14 Days</SelectItem>
              <SelectItem value="30">📅 Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 w-full bg-white rounded-lg p-4 shadow-inner" style={{ height: '400px', minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={lastSelectedRangeDaysEnergyProduction}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
              tickMargin={12}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              label={{ value: "Date", position: "insideBottom", offset: -10, style: { fill: '#374151', fontWeight: 600 } }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
              tickMargin={12}
              tickCount={8}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              label={{ value: "Energy (kWh)", angle: -90, position: "insideLeft", offset: 0, style: { fill: '#374151', fontWeight: 600 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 600, marginBottom: '4px' }}
              itemStyle={{ color: '#60A5FA', fontWeight: 500 }}
            />
            <Area
              dataKey="energy"
              type="monotone"
              fill="url(#colorEnergy)"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff' }}
            />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DataChart;