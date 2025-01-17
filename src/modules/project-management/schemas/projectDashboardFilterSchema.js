import { z } from "zod";


const projectDashboardFilterSchema = z.object({
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    workspace_id: z.number().nullable(),
    team_ids: z.array(z.number()).nullable(),
})

export default projectDashboardFilterSchema;