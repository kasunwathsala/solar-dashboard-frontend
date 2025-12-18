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
  const lastSelectedRangeDaysEnergyProduction = data.map((el) => {
    return {
      date: format(toDate(el._id.date), "MMM d"),
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
    <Card className="rounded-md p-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl font-medium text-foreground">{title}</h2>
        <div>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                className="text-foreground"
                placeholder="Select Range"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 w-full" style={{ height: '400px', minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={lastSelectedRangeDaysEnergyProduction}
            margin={{
              left: 40,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tick={false}
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickCount={10}
              label={{ value: "kWh", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Area
              dataKey="energy"
              type="natural"
              fill="#3B82F6"
              fillOpacity={0.3}
              stroke="#3B82F6"
              strokeWidth={2}
            />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DataChart;