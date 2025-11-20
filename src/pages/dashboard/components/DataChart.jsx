import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, toDate } from "date-fns";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const DataChart = ({ solarUnitId }) => {
  console.log("DataChart props:", { solarUnitId });
  
  const [selectedRange, setSelectedRange] = useState("7");

  const { data, isLoading, isError, error } =
      useGetEnergyGenerationRecordsBySolarUnitQuery({
        id: solarUnitId,
        groupBy: "daily",
        limit: parseInt(selectedRange),
      }, {
        skip: !solarUnitId // Skip API call if solarUnitId is not available
      });

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  if (isLoading) {
    return (
      <Card className="rounded-md p-4">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-medium text-foreground">Energy Production Chart</h2>
        </div>
        <div className="mt-4 h-64 flex items-center justify-center text-gray-500">
          Loading chart data...
        </div>
      </Card>
    );
  }

  if (isError) {
    console.error("DataChart API error:", error);
    return (
      <Card className="rounded-md p-4">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-medium text-foreground">Energy Production Chart</h2>
        </div>
        <div className="mt-4 h-64 flex items-center justify-center text-red-500">
          Error loading chart: {error?.message || "Unknown error"}
        </div>
      </Card>
    );
  }

  console.log("DataChart API response:", data);

  // Handle grouped daily data format from backend
  const records = Array.isArray(data) ? data : [];
  
  if (!records || records.length === 0) {
    return (
      <Card className="rounded-md p-4">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-medium text-foreground">Energy Production Chart</h2>
          <div>
            <Select value={selectedRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue className="text-foreground" placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  const lastSelectedRangeDaysEnergyProduction = records
    .slice(0, parseInt(selectedRange))
    .map((el) => {
      // Handle grouped data format: { _id: { date: "2024-11-19" }, totalEnergy: 45.5 }
      const date = el._id?.date || el.date;
      const energy = el.totalEnergy || el.energy || 0;
      
      console.log("DataChart item:", el, "Date:", date, "Energy:", energy);
      
      return {
        date: date ? format(toDate(date), "MMM d") : "N/A",
        energy: energy,
      };
    });

  const chartConfig = {
    energy: {
      label: "Energy (kWh)",
      color: "oklch(54.6% 0.245 262.881)",
    },
  };

  const title = "Energy Production Chart";

  console.log(lastSelectedRangeDaysEnergyProduction);

  return (
    <Card className="rounded-md p-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl font-medium text-foreground">{title}</h2>
        <div>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="text-foreground" placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="energy"
              type="natural"
              fill="var(--color-energy)"
              fillOpacity={0.4}
              stroke="var(--color-energy)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default DataChart;