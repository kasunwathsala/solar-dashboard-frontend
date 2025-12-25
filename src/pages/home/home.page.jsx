import HeroSection from "./components/HeroSection/HeroSection";
import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataCard from "../dashboard/components/DataCard";
import Footer from "@/components/Footer/Footer";
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
        <div className="container mx-auto px-4 mt-12 mb-12 space-y-8">
          <DataCard solarUnitId={solarUnit._id} />


         

          {/* Solar energy generation promotional / summary section (moved below widgets) */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-white/50 p-6 rounded-lg shadow-sm min-h-[360px] md:min-h-[480px]">
            <div className="w-full rounded-2xl overflow-hidden h-full">
              <img src="/assets/images/i1.jpg" alt="solar & wind" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-6 justify-center h-full py-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Your Solar Energy Generation</h2>
                <p className="mt-4 text-slate-600">This month, your solar panels generated <span className="font-medium text-sky-600">X kWh</span> of clean energy — helping you save on bills and reduce your carbon footprint. Track production trends and see how much power you contribute back to the grid.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="/assets/images/i2.jpg" alt="installation" className="w-full h-full object-cover" />
                </div>
                <div className="text-sm text-slate-700">
                  <p className="font-semibold">Installation & Maintenance</p>
                  <p className="mt-1">We provide easy setup, monitoring and scheduled checks to keep your system efficient.</p>
                </div>
              </div>
            </div>
          </section>

          

           {/* Problem / anomaly awareness section (placed before the Solar Generation promo) */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-white p-6 rounded-2xl min-h-[360px] md:min-h-[520px]">
            <div className="flex flex-col gap-6 justify-center h-full py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.723-1.36 3.488 0l5.516 9.803c.75 1.333-.213 2.998-1.744 2.998H4.485c-1.53 0-2.494-1.665-1.744-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-red-600">Problem</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Home solar systems can face reduced efficiency and missed savings due to panel shading, dirt, unexpected drops in output, or inverter issues. Stay ahead with instant anomaly alerts.</h3>

              <ul className="mt-4 space-y-3 text-slate-700">
                <li className="flex items-start gap-3"><span className="text-red-500">›</span> Panel shading or dirt</li>
                <li className="flex items-start gap-3"><span className="text-red-500">›</span> Unexpected drop in output</li>
                <li className="flex items-start gap-3"><span className="text-red-500">›</span> Inverter errors</li>
                <li className="flex items-start gap-3"><span className="text-red-500">›</span> Missed maintenance reminders</li>
              </ul>
            </div>

            <div className="w-full rounded-2xl overflow-hidden h-full">
              <img src="/assets/images/i3.jpg" alt="anomaly warning" className="w-full h-full object-cover" />
            </div>
          </section>

          {/* Feature / Solution section (using i4) */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-gradient-to-r from-sky-400 to-sky-600 text-white p-8 rounded-2xl min-h-[360px] md:min-h-[480px]">
            <div className="order-2 md:order-1 flex flex-col justify-center h-full py-4">
              <span className="inline-block bg-lime-300 text-slate-900 px-3 py-1 rounded-full mb-4 font-semibold">⚡ Solution</span>
              <h2 className="text-3xl md:text-4xl font-bold">The Solar Home Dashboard empowers you to monitor your solar panels, receive instant alerts for anomalies, and optimize your energy usage for maximum savings and peace of mind.</h2>
              <ul className="mt-6 space-y-3 text-sky-100">
                <li>› Real-time energy tracking</li>
                <li>› Anomaly alerts</li>
                <li>› Historical performance reports</li>
                <li>› Remote diagnostics & support</li>
              </ul>
            </div>

            <div className="order-1 md:order-2 w-full rounded-2xl overflow-hidden h-full">
              <img src="/assets/images/i4.jpg" alt="solution image" className="w-full h-full object-cover" />
            </div>
          </section>

          
          {/* Goals & Needs section using i5 image */}
          <section className="mt-8 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[360px] md:min-h-[520px]">
              <div className="flex flex-col justify-center h-full py-8">
                <h2 className="text-3xl font-bold text-slate-900">Goals:</h2>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Maximize solar energy savings.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Detect and resolve issues early.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Track daily, weekly, and monthly output.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Get notified of anomalies instantly.</li>
                </ul>

                <h2 className="text-3xl font-bold text-slate-900 mt-6">Needs:</h2>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> A simple dashboard for real-time monitoring.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Instant alerts for system anomalies.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Easy access to historical performance data.</li>
                  <li className="flex items-start gap-3"><span className="text-sky-600">›</span> Clear, actionable insights for better energy management.</li>
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden h-full">
                <img src="/assets/images/i5.jpg" alt="field technicians" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 21v-2a4 4 0 0 1 3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium">User Profile</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default HomePage;
