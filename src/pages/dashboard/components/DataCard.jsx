import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, toDate } from "date-fns";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { detectAnomalies, getAnomalyStats } from "@/lib/anomalyDetection";
import EnergyProductionCards from "./EnergyProductionCards";
import EnergyTab from "./EnergyTab";

const DataCard = ({ title = "Solar Energy Production", solarUnitId }) => {
  // TEACHING NOTE: Change this to switch between different detection methods
  // Options: 'windowAverage', 'absolute', 'combined'
  const [detectionMethod, setDetectionMethod] = useState('windowAverage');

  // TEACHING NOTE: Adjust these thresholds to demonstrate different sensitivity levels
  const [thresholdPercent, setThresholdPercent] = useState(40); // % below average to flag
  const [absoluteMin, setAbsoluteMin] = useState(5); // Minimum acceptable kWh

  const tabs = [
    { label: "All", value: "all" },
    { label: "Anomaly", value: "anomaly" },
  ];

  const selectedTab = useSelector((state) => state.ui.selectedDashboardTab);

  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: 7,
    });


  if (isLoading) {
    return (
      <Card className="rounded-md p-4">
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="grid grid-cols-7 gap-4 mt-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="col-span-1 px-2 py-1">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!data || isError || data.length === 0) {
    return null;
  }

  console.log(data);

  // Get last 7 days of data and filter out any undefined/null values
  const last7Days = data.slice(0, 7).filter(item => item && (item.date || item._id));

  // Apply anomaly detection with options
  const dataWithAnomalies = detectAnomalies(last7Days, detectionMethod, {
    windowThresholdPercent: thresholdPercent,
    absoluteThreshold: absoluteMin
  });

  // Transform to UI format
  const energyProductionData = dataWithAnomalies.map((el) => {
    const dateString = el.date || el._id?.date || el._id;
    return {
      day: format(toDate(dateString), "EEE"),
      date: format(toDate(dateString), "MMM d"),
      production: el.totalEnergy,
      hasAnomaly: el.hasAnomaly,
      anomalyType: el.anomalyType,
      anomalyReason: el.anomalyReason,
    };
  });

  // Filter based on selected tab
  const filteredData = energyProductionData.filter((el) => {
    if (selectedTab === "all") {
      return true;
    } else if (selectedTab === "anomaly") {
      return el.hasAnomaly;
    }
  });

  // TEACHING NOTE: Log anomaly statistics to console for students to see
  const stats = getAnomalyStats(dataWithAnomalies);
  console.log('Anomaly Detection Stats:', stats);
  console.log('Detection Method:', detectionMethod);
  console.log('Data with Anomalies:', dataWithAnomalies);

  return (
    <div className="bg-white">
      {/* Tab Filters */}
      <div className="mb-4 flex items-center gap-x-4">
        {tabs.map((tab) => {
          return <EnergyTab key={tab.value} tab={tab} />;
        })}
      </div>

      {/* Energy Production Cards */}
      <EnergyProductionCards energyProductionData={filteredData} />
    </div>
  );
};

export default DataCard;