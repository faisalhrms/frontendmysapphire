// modules/user/schemas/userManagementSchema.js
import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const emailHostEnum = z.enum(["d365", "mdaemon"], {
    errorMap: () => ({ message: "Email host must be one of 'd365' or 'mdaemon'" }),
});

const userManagementSchema = z
    .object({
        email_host: emailHostEnum,
        erp_user: z.boolean().default(false),
        one_drive: z.boolean().default(false),
        ms_team: z.boolean().default(false),
        backup_storage: z.number().min(0, "Backup storage must be a positive number"),
        subscription_ids: z.array(z.number()).min(1, "At least one subscription is required"),
        start_date: dateSchema("Start Date").nullable().optional(),
        end_date: dateSchema("End Date").nullable().optional(),
        // new optional assigned flags
        assigned_email_host: z.boolean().optional(),
        assigned_erp_user: z.boolean().optional(),
        assigned_one_drive: z.boolean().optional(),
        assigned_ms_team: z.boolean().optional(),
        assigned_backup_storage: z.boolean().optional(),
        assigned_subscriptions: z.boolean().optional(),
    })
    .refine((data) => {
        if (data.erp_user) {
            return data.email_host !== null;
        }
        return true;
    }, {
        message: "Email host is required when ERP User is true",
        path: ["email_host"],
    })
    .refine((data) => {
        if (data.erp_user) {
            return data.backup_storage > 0;
        }
        return true;
    }, {
        message: "Backup storage must be greater than 0 when ERP User is true",
        path: ["backup_storage"],
    });

export default userManagementSchema;
