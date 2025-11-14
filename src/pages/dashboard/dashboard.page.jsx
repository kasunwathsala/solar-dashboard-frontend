import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";
import DataCard from "./components/DataCard";
import DataChart from "./components/DataChart";
import { format, toDate } from "date-fns";
import { useUser } from "@clerk/clerk-react";

const DashboardPage = () => {
  const {user} = useUser();
  console.log("Dashboard user:", user);
  // Use same API approach as home page - get individual records without groupBy
  const solarUnitId = "6905bfb65ff604b96e34cd30"; // Example solar unit ID
  
  const { data, isLoading, isError, error } = useGetEnergyGenerationRecordsBySolarUnitQuery({
    id: solarUnitId,
    // Remove groupBy to get individual records for better processing
  });
  
  console.log("Dashboard API Response:", data);

  // Normalize to array regardless of envelope (same as home page)
  const records = Array.isArray(data)
    ? data
    : Array.isArray(data?.records)
    ? data.records
    : Array.isArray(data?.data)
    ? data.data
    : [];

  console.log("Normalized records:", records, "Length:", records.length);

  // Group by day and sum energy (same logic as home page)
  const processedData = (() => {
    if (!Array.isArray(records) || records.length === 0) {
      console.log("No records to process");
      return [];
    }

    const dayMap = new Map(); // yyyy-MM-dd -> { date: Date, totalEnergy: number }
    
    for (const el of records) {
      console.log("Processing dashboard element:", el);
      // For individual records, use timestamp directly
      const rawDate = el?.timestamp ?? el?.date ?? null;
      console.log("Raw date:", rawDate);
      
      let parsed = null;
      if (rawDate) {
        try {
          parsed = toDate(rawDate);
        } catch (e) {
          console.log("Date parse error:", e);
          parsed = null;
        }
      }
      
      if (!parsed || isNaN(parsed.getTime())) {
        console.log("Skipping invalid date:", rawDate);
        continue;
      }
      
      const key = format(parsed, "yyyy-MM-dd");
      // For individual records, use energyGenerated field (same as home page)
      const energy = Number(el?.energyGenerated ?? el?.totalEnergy ?? el?.energy ?? 0) || 0;
      console.log("Energy value:", energy, "from energyGenerated:", el?.energyGenerated);
      
      const prev = dayMap.get(key) ?? { date: parsed, totalEnergy: 0 };
      prev.totalEnergy += energy;
      // Keep the latest date object for this key
      if (!prev.date || parsed > prev.date) prev.date = parsed;
      dayMap.set(key, prev);
      console.log("Updated day total for", key, ":", prev);
    }

    // Convert to format expected by DataCard and DataChart: { _id: { date }, totalEnergy }
    const arr = Array.from(dayMap.values()).map((v) => ({ 
      _id: { date: v.date }, 
      totalEnergy: v.totalEnergy 
    }));
    
    const sorted = arr.sort((a, b) => toDate(b._id.date) - toDate(a._id.date));
    console.log("Final processed data:", sorted.slice(0, 3));
    return sorted;
  })();

  console.log("Processed data length:", processedData.length);

  if (isError) {
    return (
      <main className="mt-4">
        <h1 className="text-4xl font-bold text-foreground">{user?.firstName}'s House</h1>
        <div className="mt-8 text-red-500">Error loading data: {error?.message || "Unknown error"}</div>
      </main>
    );
  }

  return (
    <main className="mt-4">
      <h1 className="text-4xl font-bold text-foreground">{user?.firstName || 'User'}'s House</h1>
      <p className="text-gray-600 mt-2">Welcome back to your Solar Energy Production Dashboard</p>
      <div className="mt-8">
        <DataCard
          solarUnitId={solarUnitId}
          // data={processedData}
          // isLoading={isLoading}
          // isError={isError}
          // error={error}
          title="Last 7 Days Energy Production"
        />
      </div>
      <div className="mt-8">
        <DataChart
          // data={processedData}
          // isLoading={isLoading}
          // isError={isError}
          // error={error}
          solarUnitId={solarUnitId}
        />
      </div>
    </main>
  );
};

export default DashboardPage;