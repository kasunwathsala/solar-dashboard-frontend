import SolarUnitsTab from "./components/SolarUnitsTab";

const SolarUnitsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solar Units</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and monitor all solar units in the system
        </p>
      </div>
      <SolarUnitsTab />
    </div>
  );
};

export default SolarUnitsPage;