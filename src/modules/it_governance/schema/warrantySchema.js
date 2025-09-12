// @modules/it_governance/schema/warrantySchema.js
import { z } from "zod";

const warrantySchema = z.object({
    equipment_and_services: z
        .string({ required_error: "Equipment & Services description is required" })
        .min(1, "Equipment & Services description is required"),

    warranty_period: z.enum(
        [
            // Include all possible LOV values your backend exposes (example set)
            "1_month", "2_months", "3_months", "4_months", "5_months", "6_months",
            "7_months", "8_months", "9_months", "10_months", "11_months", "12_months",
            "1_year", "2_years", "na",
        ],
        { required_error: "Warranty period is required" }
    ),

    vendor: z
        .string({ required_error: "Vendor is required" })
        .min(1, "Vendor is required"),

    client: z
        .string({ required_error: "Client is required" })
        .min(1, "Client is required"),

    exclusions: z
        .array(
            z.string().min(1, "Each exclusion must be a non-empty string"),
            { required_error: "At least one exclusion is required" }
        )
        .min(1, "Please select at least one exclusion"),

    service_credits: z
        .string({ required_error: "Service credits are required" })
        .min(1, "Service credits are required"),

    confidentiality_protocols: z
        .string({ required_error: "Confidentiality protocols are required" })
        .min(1, "Confidentiality protocols are required"),

    warranty_ends: z
        .number({ required_error: "Warranty ends is required" })
        .int()
        .nonnegative(),

    disputes_resolved: z.enum(
        ["negotiation", "mediation", "arbitration"],
        { required_error: "Disputes resolved is required" }
    ),


    attachment_ids: z
        .array(z.preprocess((v) => Number(v), z.number().int().positive()))
        .optional(),
});

export default warrantySchema;
