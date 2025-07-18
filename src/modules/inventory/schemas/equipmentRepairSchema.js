// @modules/inventory/schemas/equipmentRepairSchema.js
import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

const repairStatus = z.enum([
    "open",
    "in_progress",
    "closed"
]);

export const equipmentRepairSchema = z.object({
    issue_description: z.string().min(1, "Issue description is required"),
    repair_cost: z.preprocess((val) => {
        if (typeof val === "string" || typeof val === "number") {
            const parsed = Number(val);
            return isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
    }, z.number().min(0, "Repair cost must be non-negative")),
    pr_po_number: z.string().optional(),
    repair_date: dateSchema('Repair Date', true),
    turnaround_time: z.number().int().positive("Turnaround time must be a positive integer"),
    vendor_details: z.string().optional(),
    status: repairStatus.default("open"),
    attachment_ids: z.array(z.number()).optional().default([]),
});