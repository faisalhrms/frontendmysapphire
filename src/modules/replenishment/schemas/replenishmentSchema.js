import { z } from "zod";
import {dateSchema} from "@helpers/schema.js";
// const fromWarehouseFieldSchema = z.object({
//     name: z.string().optional(),
//     priority: z.number().optional(),
// }).refine((data) => {
//     return !(data.name && !data.priority);
// }, {
//     message: "Priority is required when name is provided.",
//     path: ["priority"],
// });

const replenishmentSchema = z.object({
    split_report: z.boolean(),
    standard_deviations: z
        .preprocess((val) => {
            const parsedValue = parseFloat(Number(val).toFixed(2));
            return isNaN(parsedValue) ? 0.00 : parsedValue;
        }, z.number())
        .refine((val) => val >= 0.00 && val <= 5.00, {
            message: "Standard deviations must be between 0.00 and 5.00",
        }),
    forecast_method: z.string().min(1),
    from_date: dateSchema('From'),
    launches: z.array(z.string()).optional(),
    launch_aging: z.number().min(1),
    to_date: dateSchema('To'),
    category: z.string().min(1),
    min_qty: z.number().min(1),
    excluded_from_date: dateSchema('Excluded From', true),
    excluded_to_date: dateSchema('Excluded To', true),
    forecast_days: z.number().min(1),
    // from_warehouses: z.array(fromWarehouseFieldSchema).optional(),
    reason_code: z.number().min(1),
    plan_ship_date: dateSchema('Plan Ship Date'),
    plan_receive_date: dateSchema('Plan Receive Date'),
    comment:z.string().min(1, 'Comment is required field'),
}).refine(data => {
    if (data.from_date && data.to_date) {
        return new Date(data.to_date) >= new Date(data.from_date);
    }
    return true;
}, {
    message: "To date must be greater than or equal to From Sale Date",
    path: ["to_date"],
});

export default replenishmentSchema;