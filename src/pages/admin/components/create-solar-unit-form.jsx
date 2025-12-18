import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateSolarUnitMutation, useGetAllUsersQuery } from "@/lib/redux/query"
import { useNavigate } from "react-router"

const formSchema = z.object({
    serialNumber: z.string().min(1, { message: "Serial number is required" }),
    installationDate: z.string().min(1, { message: "Installation date is required" }),
    capacity: z.number().positive({ message: "Capacity must be a positive number" }),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], { message: "Please select a valid status" }),
    userid: z.string().optional(),
  });

export function CreateSolarUnitForm() {
    const navigate = useNavigate();
    const [createSolarUnit, { isLoading: isCreatingSolarUnit }] = useCreateSolarUnitMutation();
    const { data: users, isLoading: isLoadingUsers } = useGetAllUsersQuery();
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNumber: "",
            installationDate: "",
            capacity: "",
            status: "",
            userid: "",
        }
    });

    async function onSubmit(values) {
        try {
            // Remove userid if it's empty string
            const payload = {
                ...values,
                ...(values.userid === "" ? {} : { userid: values.userid })
            };
            
            // Remove userid completely if empty
            if (payload.userid === "") {
                delete payload.userid;
            }
            
            console.log("🚀 Creating solar unit with payload:", payload);
            const result = await createSolarUnit(payload).unwrap();
            console.log("✅ Solar unit created successfully:", result);
            alert("Solar unit created successfully!");
            form.reset();
            navigate("/admin/solar-units");
        } catch (error) {
            console.error("❌ Error creating solar unit:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            
            // Extract error message
            let errorMessage = 'Unknown error';
            if (error?.data?.errors) {
                // Zod validation errors
                errorMessage = error.data.errors.map(e => `${e.path?.join('.')}: ${e.message}`).join(', ');
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            alert(`Failed to create solar unit:\n${errorMessage}`);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serial Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Serial Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="installationDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Installation Date</FormLabel>
                            <FormControl>
                                <Input placeholder="Installation Date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity (kW)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    placeholder="Enter capacity in kW (e.g., 5000)" 
                                    {...field} 
                                    onChange={(e) => {
                                        const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                                        field.onChange(value);
                                    }} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select value={field.value || ""} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userid"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign to User (Optional)</FormLabel>
                            <FormControl>
                                <Select value={field.value || ""} onValueChange={field.onChange} disabled={isLoadingUsers}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select User (Optional)"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None - Don't assign to any user</SelectItem>
                                        {users?.map((user) => (
                                            <SelectItem key={user._id} value={user._id}>
                                                {user.email} {user.role === 'admin' ? '(Admin)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Optionally assign this solar unit to a user. You can assign it later via edit.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isCreatingSolarUnit}>
                    {isCreatingSolarUnit ? "Creating..." : "Create Solar Unit"}
                </Button>
            </form>
        </Form>
    );
}