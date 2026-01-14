import { z } from "zod";

const competitorSchema = z.object({
  competitor_type: z.string().min(1, "Competitor type is required"),
  title: z.string().min(1, "Title is required").max(500, "Title must be at most 500 characters"),
  attachment_ids: z.array(z.number()).optional(),
});

export default competitorSchema;
