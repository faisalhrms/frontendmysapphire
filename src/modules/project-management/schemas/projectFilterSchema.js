import { z } from "zod";
import {statusEnum} from "@modules/project-management/schemas/projectSchema.js";
import {prioritiesEnum} from "@modules/project-management/schemas/projectSchema.js";


const projectFilterSchema = z.object({
    workspaces: z.array(z.number()).nullable(),
    status: statusEnum.nullable().default(null),
    priority: prioritiesEnum.nullable().default(null),
})

export default projectFilterSchema;