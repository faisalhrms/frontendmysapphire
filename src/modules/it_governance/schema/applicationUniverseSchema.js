import { z } from "zod";

const applicationUniverseSchema = z.object({
    application_name: z
        .string({ required_error: "Application name is required" })
        .min(1, "Application name is required"),

    application_ownership: z
        .string({ required_error: "Application ownership is required" })
        .min(1, "Application ownership is required"),

    application_versions: z
        .string({ required_error: "Application versions are required" })
        .min(1, "Application versions are required"),

    application_type: z.enum(
        ["in_house", "purchased", "customized", "offshore","other"],
        { required_error: "Application type is required" }
    ),

    backend_database: z
        .string({ required_error: "Backend database is required" })
        .min(1, "Backend database is required"),

    platform: z
        .string({ required_error: "Platform is required" })
        .min(1, "Platform is required"),

    integrations: z
        .string({ required_error: "Integrations are required" })
        .min(1, "Integrations are required"),

    attachment_ids: z
        .array(z.preprocess((v) => Number(v), z.number().int().positive()))
        .optional(),
});

export default applicationUniverseSchema;
