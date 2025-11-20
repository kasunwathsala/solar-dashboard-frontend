import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, toDate } from "date-fns";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const DataCard = ({ title = "Data Overview", solarUnitId  }) => {
  console.log("DataCard props:", { title, solarUnitId });

  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: solarUnitId,
      groupBy: "daily",
      limit: 7,
    }, {
      skip: !solarUnitId // Skip API call if solarUnitId is not available
    });

  if (isLoading) {
    return (
      <Card className="rounded-md p-4">
        <Skeleton className="h-6 w-64 mb-4" />
        <div className="grid grid-cols-7 gap-4 mt-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="col-span-1 px-2 py-1">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    console.error("DataCard API error:", error);
    return (
      <Card className="rounded-md p-4">
        <h2 className="text-xl font-medium text-foreground">
          {title}
        </h2>
        <div className="mt-4 text-red-500">Error loading data: {error?.message || "Unknown error"}</div>
      </Card>
    );
  }

  console.log("DataCard API response:", data);

  // Handle grouped daily data format from backend
  const records = Array.isArray(data) ? data : [];
  
  if (!records || records.length === 0) {
    return (
      <Card className="rounded-md p-4">
        <h2 className="text-xl font-medium text-foreground">
          {title}
        </h2>
        <div className="mt-4 text-gray-500">No data available</div>
      </Card>
    );
  }

  return (
    <Card className="rounded-md p-4">
      <h2 className="text-xl font-medium text-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-7 gap-4 mt-4">
        {records.slice(0, 7).map((el, index) => {
          // Handle grouped data format: { _id: { date: "2024-11-19" }, totalEnergy: 45.5 }
          const date = el._id?.date || el.date;
          const energy = el.totalEnergy || el.energy || 0;
          
          console.log("DataCard item:", el, "Date:", date, "Energy:", energy);
          
          return (
            <div
              key={date || index}
              className="col-span-1 px-2 py-1 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xs text-gray-500 font-medium ">
                  {date ? format(toDate(date), "MMM d") : "N/A"}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  {energy.toFixed(1)} kWh
                </p>
              </div>
            </div>  
          );
        })}
      </div>
    </Card>
  );
};

export default DataCard;