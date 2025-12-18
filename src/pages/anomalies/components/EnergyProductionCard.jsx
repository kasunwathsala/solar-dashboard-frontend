import { useState } from "react";

const EnergyProductionCard = (props) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <button
      className={`w-full min-h-32 cursor-pointer ${
        isSelected ? "outline-2 outline-offset-2 outline-blue-600" : ""
      } relative border ${
        props.hasAnomaly ? "border-red-500" : "border-gray-300"
      } rounded-lg transition-all hover:shadow-md overflow-hidden`}
      onClick={handleClick}
      title={props.hasAnomaly ? props.anomalyReason : "Normal operation"}
    >
      {props.hasAnomaly && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm rounded-bl-lg">
          Anomaly
        </div>
      )}
      <div className="flex flex-col items-center gap-1 p-2 pb-1">
        <span className="block text-gray-600 text-xs font-medium truncate">
          {props.day}
        </span>
        <span className="block text-xs text-gray-500 truncate">{props.date}</span>
      </div>
      <div className="p-2 pt-1 flex flex-col items-center">
        <span
          className={`block mb-1 text-lg font-bold truncate ${
            props.hasAnomaly ? "text-red-600" : "text-blue-600"
          }`}
        >
          {typeof props.production === 'number' ? props.production.toFixed(1) : props.production}
        </span>
        <span className="block text-xs font-medium text-gray-500">kWh</span>

        {props.hasAnomaly && props.anomalyType && (
          <div className="mt-2 px-2 py-1 bg-red-50 rounded text-xs text-red-700">
            {props.anomalyType}
          </div>
        )}
      </div>

      {isSelected && props.hasAnomaly && props.anomalyReason && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 p-2 text-xs text-red-700 border-t border-red-200">
          {props.anomalyReason}
        </div>
      )}
    </button>
  );
};

export default EnergyProductionCard;
