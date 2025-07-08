import { z } from 'zod';

const policySchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be at most 1000 characters'),
    is_public: z.boolean(),
    attachment_ids: z.array(z.number()).optional(),
    department_ids: z.array(z.number()).optional(),
    user_ids: z.array(z.number()).optional(),
    company_ids: z.array(z.number())
}).refine((data) => {
    if (!data.is_public && data.company_ids.length === 0) {
        return false;
    }
    return true;
}, {
    message: 'Select at least one company for Private policies',
    path: ['company_ids']
});

export default policySchema;
