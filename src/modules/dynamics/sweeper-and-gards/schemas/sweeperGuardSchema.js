import { z } from "zod";

const categoryDesignSchema = z.object({
    category: z.coerce.number({
        required_error: "Category is required",
        invalid_type_error: "Category must be a number",
    }).min(1, "Category is required"),

    design_pieces: z.coerce.number({
        required_error: "Design pieces is required",
        invalid_type_error: "Design pieces must be a number",
    }).min(1, "Design pieces must be at least 1"),

    area_sq_feet: z.coerce.number({
        required_error: "Area (sq. feet) is required",
        invalid_type_error: "Area must be a number",
    }).min(1, "Area must be at least 1"),
});

const sweeperGuardSchema = z.object({
    store_id: z.coerce.number().min(1, "Store is required"),
    num_of_guards: z.coerce.number().min(1, "At least 1 guard is required"),
    num_of_sweepers: z.coerce.number().min(1, "At least 1 sweeper is required"),
    num_of_stock_helpers: z.coerce.number().min(1, "At least 1 stock helper is required"),
    leased_area_total: z.coerce.number().min(1, "Leased area total must be at least 1"),
    store_capacity_total: z.coerce.number().min(1, "Store capacity must be at least 1"),
    category_designs: z.array(categoryDesignSchema).min(1, "At least one category design is required"),
});

export default sweeperGuardSchema;
