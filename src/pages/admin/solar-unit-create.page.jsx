import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SolarUnitCreatePage() {
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
  };

  return (
    <main className="mt-4">
      <h1 className="text-4xl font-bold text-foreground">Create Solar Unit</h1>
      <p className="text-gray-600 mt-2">Create a new solar unit</p>
      <div className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="w-1/2">
            <div className="grid gap-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input type="text" id="serialNumber" required name="serialNumber" />
            </div>

            <div className="mt-4">
            <Button type="submit">Create</Button> 
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}