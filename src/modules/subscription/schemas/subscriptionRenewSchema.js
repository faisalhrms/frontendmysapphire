import * as z from "zod";

const subscriptionRenewSchema = z.object({
    subscription_id: z.number().nonnegative("Subscription ID must be positive"),
    started_at: z.string().nonempty("Start Date is required"),
    ended_at: z.string().nonempty("End Date is required"),
    payment_cycle: z.string().nonempty("Payment Cycle is required"),
    currency: z.string().nonempty("Currency is required"),
    amount: z.string().nonempty("Amount must be positive"),
    payment_method: z.string().nonempty("Payment Method is required"),
    payment_status: z.string().nonempty("Payment Status is required"),
    attachment_ids: z.array(z.number()).nullable().optional(),
    description: z.string().optional(),
}).refine((data) => {
    const startDate = new Date(data.started_at);
    const endDate = new Date(data.ended_at);
    return startDate <= endDate; // Ensure start date is not greater than end date
}, {
    message: "Start Date cannot be greater than End Date",
    path: ["started_at"], // Path to highlight in errors
}).refine((data) => {
    const startDate = new Date(data.started_at);
    const endDate = new Date(data.ended_at);
    return endDate >= startDate; // Ensure end date is not less than start date
}, {
    message: "End Date cannot be less than Start Date",
    path: ["ended_at"], // Path to highlight in errors
});

export default subscriptionRenewSchema;
