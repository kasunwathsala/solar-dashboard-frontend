import { useState } from "react";
import SolarUnitsTab from "./components/SolarUnitsTab";
import SettingsTab from "./components/SettingsTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("solar-units");

  const tabs = [
    { id: "solar-units", name: "Solar Units", component: SolarUnitsTab },
    { id: "settings", name: "Settings", component: SettingsTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SolarUnitsTab;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage solar units and system settings
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-200`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
}