import { z } from "zod"

export const roadmapFiltersSchema = z
  .object({
    business_unit: z.string().nonempty("Select a Business Unit"),
    quality: z
      .number({ invalid_type_error: "Select a Quality" })
      .int("Quality must be an integer"),
    process_method: z
      .number({ invalid_type_error: "Select a Process Method" })
      .int("Process Method must be an integer"),
    product: z
      .number({ invalid_type_error: "Select a Product" })
      .int("Product must be an integer"),
  })
