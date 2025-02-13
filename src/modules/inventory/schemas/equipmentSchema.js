import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

// Define Equipment Status as an enum based on Django's EquipmentStatus
const equipmentStatus = z.enum([
    'brand_new',
    'faulty',
    'functional',
    'lost',
    'sold_to_employee',
    'write_off',
]);
const subEquipmentSchema = z.object({
    type_id: z.number().min(1, "Type is required"),
    description: z.string().nonempty("Description is required"),
    qty: z.number().min(1, "Quantity must be at least 1"),
    status: z.string().nonempty("Status is required"),
});

const equipmentSchema = z.object({
    equipment_site_id: z.number().min(1, "Site is required"),
    department_id: z.number().min(1, "Department is required"),
    location_id: z.number().min(1, "Location is required"),

    code: z.number().min(1, "Code is required"),
    equipment_type_id: z.number().min(1, "Type is required"),
    asset_code: z.string().min(1, "Asset Code is required"),
    serial_no: z.string()
        .min(1, "Serial Number is required"),
        // .regex(/^[A-Za-z0-9\-]+$/, "Serial number must be alphanumeric."),
    part_no: z.string().min(1, "Part No is required").nullable().optional(),
    status: equipmentStatus.nullable().optional(),
    custodian_id: z.number().min(1, "Custodian Name is required").nullable().optional(),
    purchase_date: dateSchema('Purchase Date',true).optional(),
    handover_date: dateSchema('HandOver Date',true).optional(),
    maturity_date: dateSchema('Maturity Date',true).optional(),
    antivirus: z.boolean().optional(),
    store_comm_ready: z.boolean().optional(),
    description: z.string().max(1000, "Description can be at most 1000 characters").optional(),
    specs: z.string().max(500, "Specs can be at most 500 characters").optional(),
    attachment_ids: z.array(z.number()).nullable().optional(),
    sub_equipments: z.array(subEquipmentSchema).optional(),
});

export default equipmentSchema;

