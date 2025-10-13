import Navigation from "@/components/Navigation/Navigation";
import HeroSection from "@/pages/home/components/HeroSection/HeroSection";
import SolarEnergyProduction from "@/pages/home/components/SolarEnergyProduction";

const HomePage = () => {
   return (
    <>
      {/* <Navigation /> */}
      <main>
        <HeroSection />
        <SolarEnergyProduction />
      </main>
    </>
  );
};

export default HomePage;
