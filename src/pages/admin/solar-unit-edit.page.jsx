import { useGetSolarUnitByIdQuery } from "@/lib/redux/query";
import { useNavigate, useParams } from "react-router";
import { EditSolarUnitForm } from "./components/edit-solar-unit-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function SolarUnitEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitByIdQuery(id);

  if (isLoadingSolarUnit) {
    return (
      <main className="mt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading solar unit...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isErrorSolarUnit) {
    return (
      <main className="mt-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/solar-units")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <Card className="p-6">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">Error Loading Solar Unit</p>
            <p className="text-sm">{errorSolarUnit?.message || 'Solar unit not found'}</p>
          </div>
        </Card>
      </main>
    );
  }

  if (!solarUnit) {
    return (
      <main className="mt-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/solar-units")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Solar Unit Not Found</p>
            <p className="text-sm text-muted-foreground">The requested solar unit could not be found.</p>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mt-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/solar-units")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-4xl font-bold text-foreground">Edit Solar Unit</h1>
      </div>
      
      <h2 className="mt-4 text-2xl font-bold text-foreground">
        {solarUnit?.serialNumber || 'Solar Unit'}
      </h2>
      <p className="text-gray-600 mt-2">Edit the details of the solar unit</p>
      
      <div className="mt-8">
        <EditSolarUnitForm solarUnit={solarUnit} />
      </div>
    </main>
  );
}