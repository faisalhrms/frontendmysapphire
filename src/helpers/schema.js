import {z} from "zod";

export const dateSchema = (fieldName, isOptional = false) => {
    const base = z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName} must be in YYYY-MM-DD format`);

    if (isOptional) {
        return z.union([base, z.string().length(0), z.null(), z.undefined()])
            .transform(val => val === '' ? null : val);
    }

    return base.refine(val => !!val, {
        message: `${fieldName} is required`,
    });
};


export const dateTimeSchema = (fieldName, isOptional = false) => {
    let schema = z
        .string();

    if (!isOptional) {
        schema = schema.or(z.null()).refine(val => val !== null, {
            message: `${fieldName} is required`,
        });
    }

    return isOptional ? schema.optional().or(z.null()) : schema;
};