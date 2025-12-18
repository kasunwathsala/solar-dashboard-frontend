import { useGetSolarUnitForUserQuery, useGetEnergyGenerationRecordsBySolarUnitIdQuery } from "@/lib/redux/query";
import { useUser } from "@clerk/clerk-react";
import DataCard from "./components/DataCard";
import EnergyProductionCards from "./components/EnergyProductionCards";
import EnergyTab from "./components/EnergyTab";
import { useSelector } from "react-redux";
import { detectAnomalies, getAnomalyStats } from "@/lib/anomalyDetection";
import { format, subDays, startOfDay } from "date-fns";

const tabs = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

const AnomaliesPage = () => {
  const { user, isLoaded } = useUser();
  const selectedTab = useSelector((state) => state.ui.selectedAnomaliesTab || '7days');

  const { 
    data: solarUnit, 
    isLoading: isLoadingSolarUnit, 
    isError: isErrorSolarUnit, 
    error: errorSolarUnit 
  } = useGetSolarUnitForUserQuery();

  const {
    data: energyData,
    isLoading: isLoadingEnergy,
    isError: isErrorEnergy,
  } = useGetEnergyGenerationRecordsBySolarUnitIdQuery(solarUnit?._id, {
    skip: !solarUnit?._id,
  });

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading user session...</p>
        </div>
      </div>
    );
  }

  if (isLoadingSolarUnit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p>Loading solar unit data...</p>
        </div>
      </div>
    );
  }

  if (isErrorSolarUnit) {
    return (
      <div className="mt-4 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Connection Error</h2>
        <p>Failed to load solar unit data. Please try again later.</p>
      </div>
    );
  }

  if (!solarUnit) {
    return (
      <div className="mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">🌞 Solar Unit Required</h2>
        <p className="text-yellow-700 mb-3">
          No solar unit is currently assigned to your account. Anomaly detection requires an active solar unit.
        </p>
        <p className="text-sm text-gray-600">
          Please contact your administrator to have a solar unit added to your account.
        </p>
      </div>
    );
  }

  // Process energy data for anomalies
  let dailyData = [];
  let stats = { total: 0, anomalies: 0, normal: 0 };
  
  if (energyData && energyData.length > 0) {
    const daysToShow = selectedTab === "7days" ? 7 : 30;
    const cutoffDate = startOfDay(subDays(new Date(), daysToShow - 1));
    
    // Filter data based on selected tab
    const filteredData = energyData.filter((record) => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= cutoffDate;
    });

    // Group by date and calculate daily totals
    const dailyMap = new Map();
    filteredData.forEach((record) => {
      const date = format(new Date(record.timestamp), "yyyy-MM-dd");
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, totalEnergy: 0, records: [] });
      }
      const day = dailyMap.get(date);
      day.totalEnergy += record.energyGenerated;
      day.records.push(record);
    });

    // Convert to array and sort
    dailyData = Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Add day names and formatted dates
    dailyData = dailyData.map((day) => ({
      ...day,
      day: format(new Date(day.date), "EEE"),
      date: format(new Date(day.date), "MMM dd"),
    }));

    // Detect anomalies
    dailyData = detectAnomalies(dailyData, "windowAverage", {
      thresholdPercent: 40,
    });

    // Get statistics
    stats = getAnomalyStats(dailyData);
  }

  return (
    <main className="mt-4">
      <h1 className="text-4xl font-bold text-foreground">Anomaly Detection</h1>
      <p className="text-gray-600 mt-2">
        Monitor unusual patterns in your solar energy production
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <EnergyTab key={tab.value} tab={tab} />
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard
          title="Total Days Analyzed"
          value={stats.total}
          subtitle={`${selectedTab === '7days' ? 'Last 7 days' : 'Last 30 days'}`}
        />
        <DataCard
          title="Anomalies Detected"
          value={stats.anomalies}
          subtitle={`${((stats.anomalies / stats.total) * 100 || 0).toFixed(1)}% of total days`}
        />
        <DataCard
          title="Normal Operation"
          value={stats.normal}
          subtitle={`${((stats.normal / stats.total) * 100 || 0).toFixed(1)}% of total days`}
        />
      </div>

      {/* Daily Production Cards */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Daily Energy Production</h2>
        {isLoadingEnergy ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : isErrorEnergy ? (
          <p className="text-red-600">Failed to load energy data</p>
        ) : (
          <EnergyProductionCards dailyData={dailyData} />
        )}
      </div>

      {/* Anomaly List */}
      {stats.anomalies > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Detected Anomalies</h2>
          <div className="space-y-4">
            {dailyData
              .filter((day) => day.hasAnomaly)
              .map((day) => (
                <div
                  key={day.date}
                  className="border border-red-300 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">
                        {day.day}, {day.date}
                      </h3>
                      <p className="text-red-600 mt-1">{day.anomalyReason}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Production: {day.totalEnergy.toFixed(1)} kWh
                      </p>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded">
                      {day.anomalyType}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default AnomaliesPage;
