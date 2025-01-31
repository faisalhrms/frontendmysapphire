import {z} from "zod";
import {dateSchema} from "@helpers/schema.js";
import {prioritiesEnum} from "@modules/sr-management/services/Pending.js";

const pendingReqTaskSchema = () => z.object({


    user_ids: z
        .array(z.number())
        .min(1, {message: "Select at least one user"}),
    started_at: dateSchema()
        .optional()
        .default(() => new Date().toISOString()),
    sr_type: z
        .number()
        .min(1, {message: "SR Type is required and must be a valid number"}),
    team_group_id: z
        .number()
        .min(1, {message: "Team Group is required"}),
    location_id: z
        .number()
        .min(1, {message: "Select a location"}),
    priority: prioritiesEnum.default("low"),
    sla_hours: z.union([
        z.number().min(1, "SLA Hours must be a number greater than 0"),
        z.string().refine((val) => {
            const num = Number(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "SLA Hours must be a number greater than 0"
        })
    ]),

    description: z
        .string()
        .nullable()
        .default(""),
    ended_at: dateSchema()
        .optional()
        .nullable(),
})
    .superRefine((data, ctx) => {
        console.log("Validated Data:", data);
    });
export default pendingReqTaskSchema;
