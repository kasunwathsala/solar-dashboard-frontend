import React from "react";
import EnergyProductionCards from "./EnergyProductionCards";
import Tab from "@/components/Tab";
import { useSelector } from "react-redux";
import { toDate, subDays, format } from "date-fns";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const SolarEnergyProduction = () => {
  const tabs = [
    { label: "All", value: "all" },
    { label: "Anomaly", value: "anomaly" },
  ];

  const selectedTab = useSelector((state) => state.ui.selectedHomeTab);

  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: "6905bfb65ff604b96e34cd30",
      groupBy: "date",
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {String(error?.message || "Unknown error")}</div>;

  // Normalize to array regardless of envelope
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.records)
    ? data.records
    : Array.isArray(data?.data)
    ? data.data
    : [];

  // Group by day key and sum energy
  const dayTotals = new Map(); // yyyy-MM-dd -> { day, date, production, hasAnomaly, ts }
  for (const el of arr) {
    const rawDate = el?._id?.date ?? el?.date ?? el?.timestamp ?? null;
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
    const energy =
      Number(
        el?.totalEnergy ??
          el?.energyGenerated ??
          el?.energy ??
          el?.value ??
          0
      ) || 0;
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
          production: found.production,
          hasAnomaly: found.hasAnomaly,
        });
      } else {
        sevenDays.push({
          day: format(d, "EEE"),
          date: format(d, "MMM d"),
          production: 0,
          hasAnomaly: false,
        });
      }
    }
  }

  // Filter by tab selection
  const filtered = sevenDays.filter((el) =>
    selectedTab === "all" ? true : selectedTab === "anomaly" ? el.hasAnomaly : false
  );

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
