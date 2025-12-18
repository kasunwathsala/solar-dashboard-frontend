const EnergyProductionCards = ({ dailyData }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {dailyData && dailyData.length > 0 ? (
        dailyData.map((data) => (
          <div key={data.date} className="min-w-[120px]">
            <div
              className={`relative border ${
                data.hasAnomaly ? "border-red-500" : "border-gray-300"
              } rounded-lg p-4`}
            >
              {data.hasAnomaly && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                  Anomaly
                </div>
              )}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-600 mb-1">{data.day}</span>
                <span className="text-xs text-gray-500 mb-2">{data.date}</span>
                <span
                  className={`text-2xl font-bold ${
                    data.hasAnomaly ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {data.totalEnergy.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">kWh</span>
                {data.hasAnomaly && (
                  <div className="mt-2 text-xs text-red-600 text-center">
                    {data.anomalyType}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
  );
};

export default EnergyProductionCards;
