import EnergyProductionCards from "./EnergyProductionCards";
import Tab from "../../../components/Tab";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toDate, subDays } from "date-fns";
// import getSolarUnitById from "@/lib/api/Solar-Unit";
// import { Button } from "@/components/ui/button";
// import { getSolarUnitById } from "../../../lib/api/Solar-Unit";
import { getEnergyGenerationRecordsBySolarUnit } from "../../../lib/api/energy-generation-record";
import { useGetEnergyGenerationRecordsBySolarUnitIdQuery } from "../../../lib/redux/query";

const SolarEnergyProduction = () => {
  const energyProductionData = [
    { day: "Mon", date: "Aug 18", production: 34.1, hasAnomaly: false },
    { day: "Tue", date: "Aug 19", production: 3.2, hasAnomaly: true },
    { day: "Wed", date: "Aug 20", production: 44.7, hasAnomaly: false },
    { day: "Thu", date: "Aug 21", production: 21.9, hasAnomaly: false },
    { day: "Fri", date: "Aug 22", production: 0, hasAnomaly: true },
    { day: "Sat", date: "Aug 23", production: 43, hasAnomaly: false },
    { day: "Sun", date: "Aug 24", production: 26.8, hasAnomaly: false },
  ];

  const tabs = [
    { label: "All", value: "all" },
    { label: "Anomaly", value: "anomaly" },
  ];

  // const [selectedTab, setSelectedTab] = useState(tabs[0].value);
  
  const selectedTab = useSelector((state) => state.ui.selectedHomeTab);

  // const handleTabClick = (value) => {
  //   setSelectedTab(value);
  // };

  // const filteredEnergyProductionData =
  // selectedTab === "all"
  //   ? energyProductionData
  //   : selectedTab === "anomaly"
  //   ? energyProductionData.filter((el) => el.hasAnomaly)
  //   : [];

  const filteredEnergyProductionData = energyProductionData.filter((el) => {
    if (selectedTab === "all") {
      return true;
    } else if (selectedTab === "anomaly") {
      return el.hasAnomaly;
    }
  });

  const { data, isError, error, isLoading } = 
  useGetEnergyGenerationRecordsBySolarUnitIdQuery("6905bfb65ff604b96e34cd30");
  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (isError) {
    return <div>Error: {String(error?.message || 'Unknown error')}</div>;
  }
  if (data) {
  // console.log("Redux Toolkit Query data:", data);

  
const records = data.map((el) => ({
  ...el,
  timestamp: new Date(el.timestamp),
}));

const sevenDaysAgo = subDays(new Date(), 7);

const filteredData = records.filter((el) => el.timestamp >= sevenDaysAgo);
// console.log(filteredData);
}

  return (
    <section className="px-12 font-[Inter] py-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Solar Energy Production</h2>
        <p className="text-gray-600">Daily energy output for the past 7 days</p>
      </div>
      <div className="mt-4 flex items-center gap-x-4">
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab.value}
              tab={tab}
              // selectedTab={selectedTab}
              // onClick={handleTabClick}
            />
          );
        })}
      </div>
      {/* <div className="mt-4">
        <Button onClick={handleGetData}>get data</Button>
      </div> */}
      <EnergyProductionCards
        energyProductionData={filteredEnergyProductionData}
      />
    </section>
  );
};

export default SolarEnergyProduction;
