import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

// Enum for email host options
const emailHostEnum = z.enum(["o365", "mdaemon"], {
    errorMap: () => "Email host must be one of 'o365' or 'mdaemon'",
});

// Enum for subscriptions
const subscriptionStatusEnum = z.enum(["active", "inactive"], {
    errorMap: () => "Subscription status must be 'active' or 'inactive'",
});

const userManagementSchema = z.object({
    employee_id: z.number().min(1, "Employee ID is required"), // Employee selection
    email_host: emailHostEnum, // Static email host
    erp_user: z.boolean().default(false), // ERP User boolean
    one_drive: z.boolean().default(false), // One Drive boolean
    ms_team: z.boolean().default(false), // MS Team boolean
    backup_storage: z.number().min(0, "Backup storage must be a positive number"), // Backup storage field (number)
    subscriptions: z.array(z.number()).min(1, "At least one subscription is required"), // Multiple subscription LOV
    start_date: dateSchema("Start Date").nullable().optional(), // Optional start date
    end_date: dateSchema("End Date").nullable().optional(), // Optional end date
})
    .refine(data => {
        // Ensure ERP user cannot be true without email host
        if (data.erp_user) {
            return data.email_host !== null;
        }
        return true;
    }, {
        message: "Email host is required when ERP User is true",
        path: ["email_host"],
    })
    .refine(data => {
        // Ensure backup storage must be positive if ERP user is true
        if (data.erp_user) {
            return data.backup_storage > 0;
        }
        return true;
    }, {
        message: "Backup storage must be greater than 0 when ERP User is true",
        path: ["backup_storage"],
    });

export default userManagementSchema;
