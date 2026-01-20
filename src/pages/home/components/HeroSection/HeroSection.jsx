import { Sailboat, Shield, Triangle, Wind } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export default function HeroSection() {
  const { isSignedIn } = useUser();
  return (
    <div className="bg-background px-12 font-[Inter] transition-colors">
      {/* Navigation Bar */}
      <nav className="flex flex-wrap items-center justify-between py-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 sm:h-12 sm:w-12 shadow-md">
            <Wind className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-center text-xs font-medium text-foreground sm:text-left sm:text-sm">
            Solar Energy
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 sm:h-12 sm:w-12 shadow-md">
            <Sailboat className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-center text-xs font-medium text-foreground sm:text-left sm:text-sm">
            Home Dashboard
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 sm:h-12 sm:w-12 shadow-md">
            <Triangle className="h-5 w-5 fill-current text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-center text-xs font-medium text-foreground sm:text-left sm:text-sm">
            Real-Time Monitoring
          </span>
        </div>

        <div className="hidden flex-col items-center gap-2 sm:flex sm:flex-row sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 sm:h-12 sm:w-12 shadow-md">
            <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-center text-xs font-medium text-foreground sm:text-left sm:text-sm">
            Anomaly Detection
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-4 md:px-6 md:py-16">
        <div>
          {/* Hero Section */}
          <div className="mb-12 md:mb-24">
            <h1 className="text-4xl leading-tight font-bold text-foreground sm:text-5xl sm:leading-20 md:text-7xl md:leading-32 xl:text-8xl">
              <div>Monitor Your Home's</div>
              <div className="flex flex-row items-center gap-4 sm:gap-8">
                <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Solar Energy</span>
                <div className="relative">
                  <img
                    src="/assets/images/ddd.jpg"
                    alt="Solar panels on a house roof"
                    className="max-h-8 rounded-xl object-cover sm:max-h-16 md:max-h-20 md:rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8">
                <span>with Real-Time</span>
              </div>
              <div className="flex flex-row items-center gap-4 sm:gap-8">
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Insights & Alerts</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 sm:h-14 sm:w-14 md:h-16 md:w-16 shadow-lg">
                  <Triangle className="h-5 w-5 fill-current text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
              </div>
            </h1>
            
            {/* CTA Buttons - Only show when user is not logged in */}
            {!isSignedIn && (
              <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4">
                <a 
                  href="/sign-up" 
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all text-center"
                >
                  Get Started Free
                </a>
                <a 
                  href="/sign-in" 
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all text-center"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
