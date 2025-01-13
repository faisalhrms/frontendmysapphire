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
    equipment_site_id: z.number().min(1, "Site is required").optional(),
    department_id: z.number().min(1, "Department is required").optional(),
    location_id: z.number().min(1, "Location is required").optional(),

    code: z.number().min(1, "Code is required").optional(),
    equipment_type_id: z.number().min(1, "Type is required").optional(),
    asset_code: z.string().min(1, "Asset Code is required").optional(),
    serial_no: z.string()
        .min(1, "Serial Number is required").optional(),
        // .regex(/^[A-Za-z0-9\-]+$/, "Serial number must be alphanumeric."),
    part_no: z.string().min(1, "Part No is required").optional(),
    status: equipmentStatus.nullable().optional(),
    custodian_id: z.number().min(1, "Custodian Name is required").optional(),
    purchase_date: dateSchema('Purchase Date').optional(),
    handover_date: dateSchema('HandOver Date').optional(),
    maturity_date: dateSchema('Maturity Date').optional(),
    antivirus: z.boolean().optional(),
    store_comm_ready: z.boolean().optional(),
    description: z.string().max(1000, "Description can be at most 1000 characters").optional(),
    specs: z.string().max(500, "Specs can be at most 500 characters").optional(),
    sub_equipments: z.array(subEquipmentSchema).optional(),
});

export default equipmentSchema;

