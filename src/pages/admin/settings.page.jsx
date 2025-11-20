import SettingsTab from "./components/SettingsTab";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure system settings and preferences
        </p>
      </div>
      <SettingsTab />
    </div>
  );
};

export default SettingsPage;