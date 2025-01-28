// @modules/inventory/schemas/reassignSchema.js
import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

/**
 * Equipment Status (Enum) mirrored from your Django EquipmentStatus
 */
const equipmentStatus = z.enum([
    "brand_new",
    "faulty",
    "functional",
    "lost",
    "sold_to_employee",
    "write_off",
]);

/**
 * The Reassign Schema ensures:
 * 1. equipment_id is required (at least 1).
 * 2. new_* fields are optional but must be >= 1 if provided.
 * 3. new_status must be one of the known equipment statuses.
 * 4. handover_date and maturity_date are optional, validated as dates.
 * 5. reason is optional (text).
 */
const reassignSchema = z.object({
    equipment_id: z.number({ required_error: "Equipment ID is required" }).min(1),

    new_custodian_id: z.number().min(1, "Custodian is required"),
    new_department_id: z.number().min(1, "Department is required"),
    new_equipment_site_id: z.number().min(1, "Site is required"),
    new_location_id: z.number().min(1, "Location is required"),
    new_equipment_type_id: z.number().min(1, "Type is required"),

    new_status: equipmentStatus.optional(),

    handover_date: dateSchema("Handover Date").optional().nullable(),
    maturity_date: dateSchema("Maturity Date").optional().nullable(),

    reason: z.string().max(1000, "Reason can be at most 1000 characters").optional(),
});

export default reassignSchema;
