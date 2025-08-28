// @modules/dynamics/schemas/sweeperGuardSchema.js
import { z } from "zod";

const leasedAreaSchema = z.object({
    category: z.coerce.number({
        required_error: "Category is required",
        invalid_type_error: "Category must be a number",
    }).min(1, "Category is required"),

    area_sq_feet: z.coerce.number({
        required_error: "Area (sq. feet) is required",
        invalid_type_error: "Area must be a number",
    }).min(1, "Area must be at least 1"),
});

const categoryDesignSchema = z.object({
    category: z.coerce.number({
        required_error: "Category is required",
        invalid_type_error: "Category must be a number",
    }).min(1, "Category is required"),

    design_pieces: z.coerce.number({
        required_error: "Design pieces is required",
        invalid_type_error: "Design pieces must be a number",
    }).min(1, "Design pieces must be at least 1"),
});

const sweeperGuardSchema = z.object({
    store: z.coerce.number({
        required_error: "Store is required",
        invalid_type_error: "Store must be a number",
    }).min(1, "Store is required"),

    num_of_guards: z.coerce.number().min(0, "Guards cannot be negative"),
    num_of_sweepers: z.coerce.number().min(0, "Sweepers cannot be negative"),
    num_of_stock_helpers: z.coerce.number().min(0, "Stock helpers cannot be negative"),

    leased_area_total: z.coerce.number().min(0, "Leased area total cannot be negative"),
    store_capacity_total: z.coerce.number().min(0, "Store capacity cannot be negative"),

    leased_areas: z.array(leasedAreaSchema).min(1, "At least one leased selling area is required"),
    category_designs: z.array(categoryDesignSchema).min(1, "At least one category design is required"),
});

export default sweeperGuardSchema;
