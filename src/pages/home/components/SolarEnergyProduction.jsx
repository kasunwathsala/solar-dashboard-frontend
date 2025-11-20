import React from "react";
import EnergyProductionCards from "./EnergyProductionCards";
import Tab from "@/components/Tab";
import { useSelector } from "react-redux";
import { toDate, subDays, format } from "date-fns";
import { useGetEnergyGenerationRecordsBySolarUnitQuery, useGetSolarUnitByClerkUserIdQuery } from "@/lib/redux/query";
import { useUser } from "@clerk/clerk-react";

const SolarEnergyProduction = () => {
  const { user } = useUser();
  
  const tabs = [
    { label: "All", value: "all" },
    { label: "Anomaly", value: "anomaly" },
  ];

  const selectedTab = useSelector((state) => state.ui.selectedHomeTab);

  // Extract user ID properly to avoid [object Object] serialization  
  const userId = user?.id;
  console.log("Home page user ID:", userId, "Type:", typeof userId);
  
  // Get user-specific solar unit
  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit } = useGetSolarUnitByClerkUserIdQuery(
    userId,
    { skip: !userId }
  );

  // Get energy generation records for user's solar unit
  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: solarUnit?._id,
    }, {
      skip: !solarUnit?._id
    });

  if (isLoadingSolarUnit || isLoading) return <div>Loading...</div>;
  if (isErrorSolarUnit) return <div>Error: Solar unit not found</div>;
  if (isError) return <div>Error: {String(error?.message || "Unknown error")}</div>;
  
  // Don't render if solar unit is not loaded
  if (!solarUnit?._id) {
    return <div>No solar unit found for user</div>;
  }

  console.log("API Response:", data);

  // Normalize to array regardless of envelope
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.records)
    ? data.records
    : Array.isArray(data?.data)
    ? data.data
    : [];

  console.log("Normalized array:", arr, "Length:", arr.length);

  // Group by day key and sum energy
  const dayTotals = new Map(); // yyyy-MM-dd -> { day, date, production, hasAnomaly, ts }
  for (const el of arr) {
    console.log("Processing element:", el);
    // For individual records, use timestamp directly
    const rawDate = el?.timestamp ?? el?.date ?? null;
    console.log("Raw date:", rawDate);
    let parsed = null;
    if (rawDate) {
      try {
        parsed = toDate(rawDate);
      } catch {
        parsed = null;
      }
    }
    if (!parsed || isNaN(parsed.getTime())) continue;
    const key = format(parsed, "yyyy-MM-dd");
    // For individual records, use energyGenerated field
    const energy = Number(el?.energyGenerated ?? el?.totalEnergy ?? el?.energy ?? 0) || 0;
    console.log("Energy value:", energy, "from energyGenerated:", el?.energyGenerated);
    const prev = dayTotals.get(key) ?? {
      day: format(parsed, "EEE"),
      date: format(parsed, "MMM d"),
      production: 0,
      hasAnomaly: false,
      ts: parsed.getTime(),
    };
    prev.production += energy;
    prev.hasAnomaly = prev.hasAnomaly || Boolean(el?.hasAnomaly);
    dayTotals.set(key, prev);
    console.log("Updated day total for", key, ":", prev);
  }

  // Build exactly 7 cards: latest available day + previous 6, zero-fill gaps
  const values = Array.from(dayTotals.values());
  let sevenDays = [];
  if (values.length > 0) {
    const latestTs = values.reduce((m, v) => (v.ts > m ? v.ts : m), values[0].ts);
    for (let i = 0; i < 7; i++) {
      const d = subDays(new Date(latestTs), i);
      const key = format(d, "yyyy-MM-dd");
      const found = dayTotals.get(key);
      if (found) {
        sevenDays.push({
          day: found.day,
          date: found.date,
          production: Math.round(found.production * 10) / 10, // Round to 1 decimal
          hasAnomaly: found.hasAnomaly,
        });
      } else {
        sevenDays.push({
          day: format(d, "EEE"),
          date: format(d, "MMM d"),
          production: 0.0, // Show as decimal
          hasAnomaly: false,
        });
      }
    }
  } else {
    // If no API data, show last 7 days with 0 production
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = subDays(today, i);
      sevenDays.push({
        day: format(d, "EEE"),
        date: format(d, "MMM d"),
        production: 0.0, // Show as decimal
        hasAnomaly: false,
      });
    }
  }

  console.log("Day totals map:", dayTotals);
  console.log("Seven days data:", sevenDays);

  // Filter by tab selection
  const filtered = sevenDays.filter((el) =>
    selectedTab === "all" ? true : selectedTab === "anomaly" ? el.hasAnomaly : false
  );

  console.log("Filtered data:", filtered);
  console.log("Selected tab:", selectedTab);

  return (
    <section className="px-12 font-[Inter] py-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Solar Energy Production</h2>
        <p className="text-gray-600">Daily energy output for the past 7 days</p>
      </div>
      <div className="mt-4 flex items-center gap-x-4">
        {tabs.map((tab) => (
          <Tab key={tab.value} tab={tab} />
        ))}
      </div>
      <EnergyProductionCards energyProductionData={filtered} />
    </section>
  );
};

export default SolarEnergyProduction;
