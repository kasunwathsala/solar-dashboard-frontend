import HeroSection from "./components/HeroSection/HeroSection";
import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataCard from "../dashboard/components/DataCard";
import DataChart from "../dashboard/components/DataChart";
import { useUser } from "@clerk/clerk-react";

const HomePage = () => {
  const { user, isLoaded } = useUser();
  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

  // Check if user has a solar unit
  const isSolarUnitNotFound = isErrorSolarUnit && 
    (errorSolarUnit?.status === 404 || 
     errorSolarUnit?.originalStatus === 404 ||
     errorSolarUnit?.data?.message?.toLowerCase().includes('not found'));

  const hasSolarUnit = isLoaded && !isLoadingSolarUnit && solarUnit && !isSolarUnitNotFound;

  return (
    <main>
      <HeroSection />
      
      {/* Show dashboard cards if user has a solar unit */}
      {hasSolarUnit && (
        <div className="container mx-auto px-4 mt-12 mb-12">
          <DataCard solarUnitId={solarUnit._id} />
        </div>
      )}
    </main>
  );
};

export default HomePage;