import { z } from "zod";

const companySchema = z.object({
    id: z.number().min(1, "ID is required and must be a positive number"),
    name: z.string().min(1, "Name is required"),
    short_name: z.string().min(1, "Short Name is required"),
    business: z.string().min(1, "Business is required"),
    media: z.string().nullable().optional(),
    website: z.string().url("Website must be a valid URL").nullable().optional(),
    address: z.string().nullable().optional(),
});

const companiesSchema = z.array(companySchema);

export default companiesSchema;
