import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

// Define Equipment Status as an enum based on Django's EquipmentStatus
const equipmentStatus = z.enum([
    'no_status',
    'brand_new',
    'faulty',
    'functional',
    'lost',
    'sold_to_employee',
    'write_off',
    'temporary_allocation',
    'available_in_inventory',
    'waiting_for_scrap'
]);
const subEquipmentSchema = z.object({
    type_id: z.number().min(1, "Type is required"),
    description: z.string().nonempty("Description is required"),
    qty: z.number().min(1, "Quantity must be at least 1"),
    status: z.string().nonempty("Status is required"),
});

const equipmentSchema = z.object({
    company_id: z.number().min(1, "Company ID is required"),
    equipment_site_id: z.number().min(1, "Site is required"),
    department_id: z.number().min(1, "Department is required"),
    location_id: z.number().min(1, "Location is required"),

    // code: z.number().min(1, "Code is required"),
    equipment_type_id: z.number().min(1, "Type is required"),
    asset_code: z.string().min(1, "Asset Code is required"),
    serial_no: z.string()
        .min(1, "Serial Number is required"),
        // .regex(/^[A-Za-z0-9\-]+$/, "Serial number must be alphanumeric."),
    part_no: z.string().nullable().optional(),
    status: equipmentStatus.nullable().optional(),
    previous_custodian: z.string().max(250).nullable().optional(),
    custodian_id: z.number().min(1, "Custodian Name is required").nullable().optional(),
    purchase_date: dateSchema('Purchase Date',true).optional(),
    handover_date: dateSchema('HandOver Date',true).optional(),
    maturity_date: dateSchema('Maturity Date',true).optional(),
    warranty_expire: dateSchema('warranty expire Date',true).optional(),
    antivirus: z.boolean().optional(),
    asset_tag_available: z.boolean().optional(),
    store_comm_ready: z.boolean().optional(),
    description: z.string().max(1000, "Description can be at most 1000 characters"),
    remarks: z.string().max(200, "remarks can be at most 1000 200").nullable().optional(),
    maintenance_history: z.string().max(500, "maintenance history can be at most 500 characters").nullable().optional(),

    specs: z.string().max(500, "Specs can be at most 500 characters"),
    attachment_ids: z.array(z.number()).nullable().optional(),
    laptop_issued_as_per_policy: z.boolean().default(true),
    till_on_laptop: z.preprocess((v) => {
        if (v === "true") return true;
        if (v === "false") return false;
        return v;
    }, z.boolean()).default(false),
    exception_approval_granted_by_id: z.number().min(1, "Exception approval granted by employee (Grade G-15) is required").nullable().optional(),
    laptop_model: z.string().max(250).nullable().optional(),
    user_name: z.string().max(250).nullable().optional(),
    computer_name: z.string().max(250).nullable().optional(),

    processor: z.string().max(250).nullable().optional(),
    ram: z.string().max(250).nullable().optional(),
    purchase_price:z.number().nullable().optional(),
    hard_disk: z.string().max(250).nullable().optional(),
    screen_size: z.string().max(250).nullable().optional(),
    mouse: z.string().max(250).nullable().optional(),
    accessories: z.string().max(250).nullable().optional(),
    pos_id: z.string().max(250).nullable().optional(),
    mac: z.string().max(250).nullable().optional(),
    ip: z.string().max(250).nullable().optional(),
    // verified: z.boolean().optional(),
    // verified_on: z.date().nullable().optional(),
    // verified_by: z.object({
    //     id: z.number(),
    //     full_name: z.string(),
    //     email: z.string().email(),
    // }).nullable().optional(),
    sub_equipments: z.array(subEquipmentSchema).optional(),

    quantity: z.number().min(1, "Quantity must be at least 1").default(1), // Default to 1
    price_paid_by_employee: z.number().nullable().optional(),
});

export default equipmentSchema;

