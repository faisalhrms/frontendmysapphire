// subscriptionRenewSchema.js

import * as z from "zod";

const subscriptionRenewSchema = z.object({
    subscription_id: z.number().nonnegative("subscription_id must be positive"),
    started_at: z.string().nonempty("Start Date is required"),
    ended_at: z.string().nonempty("End Date is required"),
    payment_cycle: z.string().nonempty("Payment Cycle is required"),
    currency: z.string().nonempty("Currency is required"),
    amount: z.number().nonnegative("Amount must be positive"),
    payment_method: z.string().nonempty("Payment Method is required"),
    payment_status: z.string().nonempty("Payment Status is required"),
    attachment_ids: z.array(z.number()).nullable().optional(),
    description: z.string().optional(),

});

export default subscriptionRenewSchema;
