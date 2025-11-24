import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateSolarUnitForm } from "./components/create-solar-unit-form";

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
        
          
        <CreateSolarUnitForm />
      </div>
    </main>
  );
}