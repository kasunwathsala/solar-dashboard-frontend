import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SolarUnitsTab = () => {
  const [solarUnits, setSolarUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUnit, setNewUnit] = useState({
    serialNumber: "",
    capacity: "",
    status: "active",
    installationDate: "",
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setSolarUnits([
        {
          _id: "1",
          serialNumber: "SU-001",
          capacity: 5.5,
          status: "active",
          installationDate: "2024-01-15",
          userid: "user1",
        },
        {
          _id: "2", 
          serialNumber: "SU-002",
          capacity: 7.2,
          status: "maintenance",
          installationDate: "2024-02-20",
          userid: "user2",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateUnit = (e) => {
    e.preventDefault();
    const unit = {
      _id: Date.now().toString(),
      ...newUnit,
      capacity: parseFloat(newUnit.capacity),
    };
    setSolarUnits([...solarUnits, unit]);
    setNewUnit({
      serialNumber: "",
      capacity: "",
      status: "active",
      installationDate: "",
    });
    setShowCreateForm(false);
  };

  const handleDeleteUnit = (id) => {
    setSolarUnits(solarUnits.filter(unit => unit._id !== id));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Solar Units Management</h2>
          <p className="text-sm text-gray-600">Manage all solar units in the system</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Add New Unit"}
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Create New Solar Unit</h3>
          <form onSubmit={handleCreateUnit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={newUnit.serialNumber}
                  onChange={(e) => setNewUnit({...newUnit, serialNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. SU-003"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (kW)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newUnit.capacity}
                  onChange={(e) => setNewUnit({...newUnit, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 5.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Installation Date
                </label>
                <input
                  type="date"
                  required
                  value={newUnit.installationDate}
                  onChange={(e) => setNewUnit({...newUnit, installationDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create Unit</Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {solarUnits.map((unit) => (
            <li key={unit._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        unit.status === 'active' ? 'bg-green-400' : 
                        unit.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{unit.serialNumber}</p>
                      <p className="text-sm text-gray-500">Capacity: {unit.capacity} kW</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      unit.status === 'active' ? 'text-green-600' : 
                      unit.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Installed: {new Date(unit.installationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteUnit(unit._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {solarUnits.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No solar units</h3>
          <p className="text-sm text-gray-500">Get started by creating a new solar unit.</p>
        </div>
      )}
    </div>
  );
};

export default SolarUnitsTab;