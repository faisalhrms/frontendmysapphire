// src/modules/inlay/schemas/inlaySchema.js
import { z } from "zod";

const descItemSchema = z.object({
    label: z.string().trim().min(1, "Label is required"),
    value: z.string().trim().min(1, "Value is required"),
});

const inlaySchema = z.object({
    design_code: z.string().trim().min(1, "Design code is required").max(100),
    name: z.string().trim().min(1, "Name is required").max(255),

    is_active: z.boolean().optional().default(true),

    // keep description always as array in frontend
    description: z
        .array(descItemSchema)
        .optional()
        .default([]),
    thumbnail_id: z.union([z.number(), z.null()]).optional(),
    attachment_ids: z
        .array(z.number().int())
        .optional()
        .default([]),
});

export default inlaySchema;
