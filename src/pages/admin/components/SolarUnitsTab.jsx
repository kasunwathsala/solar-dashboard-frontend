import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetSolarUnitsQuery, useDeleteSolarUnitMutation, useSyncUsersFromClerkMutation } from "@/lib/redux/query";
import { Zap, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export function SolarUnitsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: solarUnits, isLoading: isLoadingSolarUnits, isError: isErrorSolarUnits, error: errorSolarUnits } = useGetSolarUnitsQuery();
  const [deleteSolarUnit, { isLoading: isDeleting }] = useDeleteSolarUnitMutation();
  const [syncUsers, { isLoading: isSyncing }] = useSyncUsersFromClerkMutation();

  if (isLoadingSolarUnits) {
    return <div>Loading...</div>;
  }

  if (isErrorSolarUnits) {
    return <div>Error: {errorSolarUnits.message}</div>;
  }

  console.log(solarUnits);

  // Handle potential undefined data
  const units = solarUnits || [];
  const filteredUnits = searchTerm !== "" ? units.filter(
    (unit) =>
      unit.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) : units;

  const handleDelete = async (id, serialNumber) => {
    if (window.confirm(`Are you sure you want to delete solar unit "${serialNumber}"? This action cannot be undone.`)) {
      try {
        await deleteSolarUnit(id).unwrap();
        alert("Solar unit deleted successfully!");
      } catch (error) {
        console.error("Failed to delete solar unit:", error);
        alert("Failed to delete solar unit. Please try again.");
      }
    }
  };

  const handleSyncUsers = async () => {
    if (window.confirm("Sync all users from Clerk? This will add any new users to the database.")) {
      try {
        const result = await syncUsers().unwrap();
        alert(`User sync completed! Synced: ${result.synced}, Skipped: ${result.skipped}, Total: ${result.total}`);
      } catch (error) {
        console.error("Failed to sync users:", error);
        alert("Failed to sync users. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/solar-units/create">Add New Unit</Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSyncUsers}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Syncing..." : "Sync Users from Clerk"}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search solar units..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUnits.map((unit) => (
          <Card key={unit._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold text-foreground">{unit.serialNumber}</h3>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${unit.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {unit.status}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                <p className="text-lg font-semibold text-foreground">
                  {unit.capacity}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/admin/solar-units/${unit._id}/edit`)}
                  disabled={isDeleting}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/admin/solar-units/${unit._id}`)}
                  disabled={isDeleting}
                >
                  View
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(unit._id, unit.serialNumber)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No solar units found matching "{searchTerm}"
          </p>
        </Card>
      )}
    </div>
  );
}