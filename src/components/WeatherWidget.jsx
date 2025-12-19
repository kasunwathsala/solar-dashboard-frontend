import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWeatherQuery } from "@/lib/redux/query";

const WeatherWidget = ({ latitude = 6.9271, longitude = 79.8612 }) => {
  const { data: weather, isLoading, isError } = useGetWeatherQuery({ lat: latitude, lon: longitude });

  if (isLoading) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Skeleton className="h-7 w-56 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </Card>
    );
  }

  if (isError || !weather) {
    return (
      <Card className="rounded-2xl p-8 shadow-2xl border border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 font-semibold">Unable to load weather data. Please try again later.</p>
        </div>
      </Card>
    );
  }

  const getProductionColor = (estimate) => {
    switch (estimate) {
      case 'Excellent':
        return 'text-green-700 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-300 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20';
      case 'Good':
        return 'text-blue-700 dark:text-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-300 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20';
      case 'Moderate':
        return 'text-yellow-700 dark:text-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30 border-yellow-300 dark:border-yellow-700 shadow-yellow-100 dark:shadow-yellow-900/20';
      default:
        return 'text-red-700 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-300 dark:border-red-700 shadow-red-100 dark:shadow-red-900/20';
    }
  };

  const getProductionIcon = (estimate) => {
    switch (estimate) {
      case 'Excellent':
        return <Sun className="w-10 h-10 text-yellow-500 dark:text-yellow-400 drop-shadow-lg" />;
      case 'Good':
        return <Sun className="w-10 h-10 text-orange-500 dark:text-orange-400 drop-shadow-lg" />;
      case 'Moderate':
        return <Cloud className="w-10 h-10 text-gray-600 dark:text-gray-400 drop-shadow-lg" />;
      default:
        return <CloudRain className="w-10 h-10 text-gray-700 dark:text-gray-400 drop-shadow-lg" />;
    }
  };

  const getProductionDescription = (estimate) => {
    switch (estimate) {
      case 'Excellent':
        return 'Perfect conditions for maximum solar energy generation';
      case 'Good':
        return 'Favorable conditions for efficient solar production';
      case 'Moderate':
        return 'Acceptable conditions with reduced solar efficiency';
      default:
        return 'Poor conditions may significantly impact solar output';
    }
  };

  return (
    <Card className="rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20">
            <Gauge className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Weather Insights</h3>
            <p className="text-sm text-muted-foreground">Real-time solar production conditions</p>
          </div>
        </div>
      </div>

      {/* Solar Production Estimate - Hero Card */}
      <div className={`mb-6 p-6 rounded-2xl border-2 ${getProductionColor(weather.solarProductionEstimate)} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
            {getProductionIcon(weather.solarProductionEstimate)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold opacity-80 uppercase tracking-wide mb-1">Solar Production Forecast</p>
            <p className="text-3xl font-bold mb-1">{weather.solarProductionEstimate}</p>
            <p className="text-sm opacity-75">{getProductionDescription(weather.solarProductionEstimate)}</p>
          </div>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Temperature */}
        <div className="group bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 group-hover:scale-110 transition-transform">
              <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Temperature</p>
            <p className="text-2xl font-bold text-foreground">{weather.temperature.toFixed(1)}°C</p>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 group-hover:scale-110 transition-transform">
              <Cloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cloud Cover</p>
            <p className="text-2xl font-bold text-foreground">{weather.cloudCover}%</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="group bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">UV Index</p>
            <p className="text-2xl font-bold text-foreground">{weather.uvIndex.toFixed(1)}</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="group bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
              <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wind Speed</p>
            <p className="text-2xl font-bold text-foreground">{weather.windSpeed.toFixed(1)} km/h</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="group bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-800 dark:to-cyan-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Humidity</p>
            <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
          </div>
        </div>

        {/* Precipitation */}
        <div className="group bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
              <CloudRain className="w-6 h-6 text-blue-700 dark:text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Precipitation</p>
            <p className="text-2xl font-bold text-foreground">{weather.precipitation} mm</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live data from Open-Meteo API • Updated in real-time
        </p>
      </div>
    </Card>
  );
};

export default WeatherWidget;
