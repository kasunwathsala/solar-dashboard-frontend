import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataCard from "./components/DataCard";
import DataChart from "./components/DataChart";
import WeatherWidget from "@/components/WeatherWidget";
import { useUser } from "@clerk/clerk-react";

const DashboardPage = () => {
  const { user, isLoaded } = useUser();

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

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

  // Check if error is "solar unit not found" - this is normal for users without assigned units
  const isSolarUnitNotFound = isErrorSolarUnit && 
    (errorSolarUnit?.status === 404 || 
     errorSolarUnit?.originalStatus === 404 ||
     errorSolarUnit?.data?.message?.toLowerCase().includes('not found'));

  if (isErrorSolarUnit && !isSolarUnitNotFound) {
    // This is a real error (not just "not found")
    console.error("🔴 Solar unit API error:", errorSolarUnit);
    return (
      <div className="mt-4 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Connection Error</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Status:</strong> {errorSolarUnit?.status || 'Unknown'}</p>
          <p><strong>Message:</strong> {errorSolarUnit?.data?.message || errorSolarUnit?.message}</p>
          {user && (
            <>
              <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress}</p>
              <p><strong>Clerk ID:</strong> {user.id}</p>
            </>
          )}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // Show welcome message if solar unit not found (404) or no solar unit data
  if (!solarUnit || isSolarUnitNotFound) {
    return (
      <div className="mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">🌞 Welcome to Solar Dashboard</h2>
        <p className="text-yellow-700 mb-3">
          Your account has been created successfully! However, no solar unit is currently assigned to your account.
        </p>
        <div className="bg-white p-4 rounded-lg border border-yellow-300 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>An administrator will add a solar unit to your account</li>
            <li>Once added, you'll be able to view your solar energy generation data</li>
            <li>You can track your daily energy production, view analytics, and detect anomalies</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600">
          Please contact your administrator if you've been waiting for a while or if you think this is an error.
        </p>
        {user && (
          <div className="mt-4 pt-4 border-t border-yellow-300">
            <p className="text-xs text-gray-600">
              <strong>Your Account:</strong> {user.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        )}
      </div>
    );
  }

  console.log("✅ Solar unit loaded:", solarUnit);
  console.log("🔑 Current user:", {
    id: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
    firstName: user?.firstName
  });

  return (
    <main className="mt-4">
      <h1 className="text-4xl font-bold text-foreground">{user?.firstName}'s House</h1>
      <p className="text-gray-600 mt-2">
        Welcome back to your Solar Energy Production Dashboard
      </p>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-sm transition-colors">
        <p><strong>Serial Number:</strong> {solarUnit.serialNumber}</p>
        <p><strong>Status:</strong> {solarUnit.status}</p>
      </div>

      {/* Weather Widget */}
      <div className="mt-8">
        <WeatherWidget latitude={6.9271} longitude={79.8612} />
      </div>
      
      <div className="mt-8">
        <DataCard solarUnitId={solarUnit._id} />
      </div>
      <div className="mt-8">
        <DataChart solarUnitId={solarUnit._id} />
      </div>
    </main>
  );
};

export default DashboardPage;