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
import { useEditSolarUnitMutation } from "@/lib/redux/query"
import { useParams } from "react-router"
import { useGetAllUsersQuery } from "@/lib/redux/query"

const formSchema = z.object({
    serialNumber: z.string().min(1, { message: "Serial number is required" }),
    installationDate: z.string().min(1, { message: "Installation date is required" }),
    capacity: z.number().positive({ message: "Capacity must be a positive number" }),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], { message: "Please select a valid status" }),
    userid: z.string().optional(),
});

export function EditSolarUnitForm({ solarUnit }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNumber: solarUnit.serialNumber,
            installationDate: solarUnit.installationDate,
            capacity: solarUnit.capacity,
            status: solarUnit.status,
            userid: solarUnit.userid || "",
        },
    })

    const { id } = useParams();

    const [editSolarUnit, { isLoading: isEditingSolarUnit }] = useEditSolarUnitMutation();

    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useGetAllUsersQuery();


    console.log(users);

    async function onSubmit(values) {
        try {
            console.log("🔄 Updating solar unit with values:", values);
            
            // Remove userid if it's empty string
            const payload = {
                ...values,
            };
            
            if (payload.userid === "") {
                delete payload.userid;
            }
            
            const result = await editSolarUnit({ id, data: payload }).unwrap();
            console.log("✅ Solar unit updated successfully:", result);
            alert("Solar unit updated successfully!");
        } catch (error) {
            console.error("❌ Error updating solar unit:", error);
            alert(`Failed to update solar unit: ${error?.data?.message || error.message || 'Unknown error'}`);
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
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Capacity" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isEditingSolarUnit}>{isEditingSolarUnit ? "Editing..." : "Edit"}</Button>
            </form>
        </Form>
    );
}