import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataCard from "./components/DataCard";
import DataChart from "./components/DataChart";
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

  if (isErrorSolarUnit) {
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

  if (!solarUnit) {
    return (
      <div className="mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ No Solar Unit Found</h2>
        <p className="text-yellow-700">
          No solar unit is associated with your account. Please contact an administrator.
        </p>
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
      
      {/* Debug info */}
      <div className="mt-4 p-3 bg-blue-50 rounded border text-sm">
        <p><strong>Solar Unit ID:</strong> {solarUnit._id}</p>
        <p><strong>Serial Number:</strong> {solarUnit.serialNumber}</p>
        <p><strong>Status:</strong> {solarUnit.status}</p>
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