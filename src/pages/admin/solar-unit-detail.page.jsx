import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SolarUnitDetailPage = () => {
  const { id } = useParams();
  const [solarUnit, setSolarUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockUnit = {
        _id: id,
        serialNumber: "SU-001",
        capacity: 5.5,
        status: "active",
        installationDate: "2024-01-15",
        userid: "user1",
        location: "Rooftop Panel A",
        manufacturer: "SolarTech",
        model: "ST-5500",
        efficiency: 22.5,
        warrantyExpiry: "2034-01-15",
      };
      setSolarUnit(mockUnit);
      setFormData(mockUnit);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = () => {
    setSolarUnit(formData);
    setEditing(false);
    // Here you would make an API call to update the unit
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solar Unit Details</h1>
          <p className="text-sm text-gray-600">Unit ID: {solarUnit.serialNumber}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit Unit</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{solarUnit.serialNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (kW)
              </label>
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{solarUnit.capacity} kW</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {editing ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    solarUnit.status === 'active' ? 'bg-green-400' : 
                    solarUnit.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-gray-900 capitalize">{solarUnit.status}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{new Date(solarUnit.installationDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{solarUnit.manufacturer}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{solarUnit.model}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Efficiency (%)
              </label>
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  value={formData.efficiency}
                  onChange={(e) => setFormData({...formData, efficiency: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{solarUnit.efficiency}%</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Expiry
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{new Date(solarUnit.warrantyExpiry).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">156.7</div>
            <div className="text-sm text-gray-600">Total kWh Today</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">4,892</div>
            <div className="text-sm text-gray-600">Total kWh This Month</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">98.2%</div>
            <div className="text-sm text-gray-600">Uptime This Month</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">Normal</div>
            <div className="text-sm text-gray-600">Current Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarUnitDetailPage;