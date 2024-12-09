import {z} from "zod";

// Function to create a dynamic date validation schema
export const dateSchema = (fieldName, isOptional = false) => {
    let schema = z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName} date must be in YYYY-MM-DD format`);

    // If the field is not optional, ensure it's present with a custom required message
    if (!isOptional) {
        schema = schema.or(z.null()).refine(val => val !== null, {
            message: `${fieldName} date is required`,
        });
    }

    // Make it optional if specified
    return isOptional ? schema.optional().or(z.null()) : schema;
};