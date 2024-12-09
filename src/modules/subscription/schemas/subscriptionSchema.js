import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const typeEnum = z.enum(["paid", "free"], {
    errorMap: () => "Type must be 'paid' or 'free'",
});

const subscriptionTypeEnum = z.enum(["active", "pending","canceled"], {
    errorMap: () => "Type must be 'active','pending' or 'canceled'",
});

const paymentStatusEnum = z.enum(["paid", "unpaid"], {
    errorMap: () => "Payment status must be 'paid' or 'unpaid'",
});

const paymentCycleEnum = z.enum(["monthly", "quarterly", "yearly"], {
    errorMap: () => "Payment cycle must be 'monthly', 'quarterly' or 'yearly'",
});

const currenciesEnum = z.enum(["USD", "PKR"], {
    errorMap: () => "Currency must be 'USD' or 'PKR'",
});

const reminderEnum = z.enum(['7', '14', '30'], {
    errorMap: () => "Reminder cycle must be '7', '14', or '30'",
});
const subscriptionSchema = z.object({
    name: z.string().min(1, "Name is required").max(1000, "Name must be at most 1000 characters long"),
    department_ids: z.array(z.number()).min(1, "At least one department ID is required"),
    type: typeEnum.default("paid"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be at most 1000 characters long"),
    status: subscriptionTypeEnum.nullable().optional(),
    payment_status: paymentStatusEnum.nullable().optional(),
    currency: currenciesEnum.nullable().optional(),
    payment_cycle: paymentCycleEnum.nullable().optional(),
    amount: z.union([
        z.number().min(1, "Amount must be greater than 0"),
        z.string().refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Amount must be a number greater than 0"
        })
    ]).nullable().optional(),
    reminder_days: z.union([
        z.number().min(1, "Reminder days must be a number greater than 0"),
        z.string().refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Reminder days must be a number greater than 0"
        })
    ]).nullable().optional(),
    started_at: dateSchema("Start Date").nullable().optional(),
    ended_at: dateSchema("End Date").nullable().optional(),
    vendor_id: z.number().nullable().optional(),
    attachment_ids: z.array(z.number()).nullable().optional(),
})
    .refine(data => {
        // Check if amount is required and present for paid subscriptions
        if (data.type === "paid") {
            return data.amount !== null;
        }
        return true;
    }, {
        message: "Amount is required for paid subscriptions",
        path: ["amount"],
    })
    .refine(data => {
        // Check if currency is required and present for paid subscriptions
        if (data.type === "paid") {
            return data.currency !== null;
        }
        return true;
    }, {
        message: "Currency is required for paid subscriptions",
        path: ["currency"],
    })
    .refine(data => {
        // Check if payment_cycle is required and present for paid subscriptions
        if (data.type === "paid") {
            return data.payment_cycle !== null;
        }
        return true;
    }, {
        message: "Payment cycle is required for paid subscriptions",
        path: ["payment_cycle"],
    })
    .refine(data => {
        // Check if payment_status is required and present for paid subscriptions
        if (data.type === "paid") {
            return data.payment_status !== null;
        }
        return true;
    }, {
        message: "Payment status is required for paid subscriptions",
        path: ["payment_status"],
    })
    .refine(data => {
        // Check if vendor_id is required and present for paid subscriptions
        if (data.type === "paid") {
            return data.vendor_id !== null;
        }
        return true;
    }, {
        message: "Vendor is required for paid subscriptions",
        path: ["vendor_id"],
    })
    .refine(data => {
        // Ensure end date is after start date if both dates are provided
        if (data.started_at && data.ended_at) {
            return new Date(data.ended_at) >= new Date(data.started_at);
        }
        return true;
    }, {
        message: "End date must be greater than or equal to start date",
        path: ["ended_at"],
    });

export default subscriptionSchema;
