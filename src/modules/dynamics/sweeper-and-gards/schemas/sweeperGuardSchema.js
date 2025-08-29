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
    store_id: z.coerce.number({
        required_error: "Store is required",
        invalid_type_error: "Store must be a number",
    }).min(1, "Store is required"),

    num_of_guards: z.coerce.number({
        required_error: "Number of guards is required",
        invalid_type_error: "Guards must be a number",
    }).min(1, "At least 1 guard is required"),

    num_of_sweepers: z.coerce.number({
        required_error: "Number of sweepers is required",
        invalid_type_error: "Sweepers must be a number",
    }).min(1, "At least 1 sweeper is required"),

    num_of_stock_helpers: z.coerce.number({
        required_error: "Number of stock helpers is required",
        invalid_type_error: "Stock helpers must be a number",
    }).min(1, "At least 1 stock helper is required"),

    leased_area_total: z.coerce.number({
        required_error: "Leased area total is required",
        invalid_type_error: "Leased area total must be a number",
    }).min(1, "Leased area total must be at least 1"),

    store_capacity_total: z.coerce.number({
        required_error: "Store capacity total is required",
        invalid_type_error: "Store capacity total must be a number",
    }).min(1, "Store capacity must be at least 1"),

    leased_areas: z.array(leasedAreaSchema).min(1, "At least one leased selling area is required"),
    category_designs: z.array(categoryDesignSchema).min(1, "At least one category design is required"),
});

export default sweeperGuardSchema;
