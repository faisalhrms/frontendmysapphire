import { z } from "zod";
import {dateSchema} from "@helpers/schema.js";
const equipmentSchema = z.object({
    site_id: z.number().min(1,"Site is required"),
    department_id: z.number().min(1, "Department is required" ),
    location_id: z.number().min(1, "Location is required" ),

    code: z.number().min(1, "Code is required"),
    type_id: z.number().min(1, "Type is required" ),
    asset_code: z.string().min(1,"Asset Code is required"),
    serial_no: z.string().min(1,"Serial Number is required"),
    part_no: z.number().min(1, "Part No is required"),
    status_id: z.string().min(1, "Status is required" ),
    custodian_id: z.number().min(1, " Custodian Name required"),
    purchased_at:dateSchema('Purchase Date'),
    handed_at:dateSchema('HandOver Date'),
    matured_at:dateSchema('Maturity Date'),
    previous_custodian_id: z.number().min(1, " Custodian Name required"),
    antivirus: z.boolean().optional(),
    store_comm_ready: z.boolean().optional()
});

export default equipmentSchema;
