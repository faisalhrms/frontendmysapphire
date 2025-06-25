import { z } from 'zod';
import { dateSchema } from '@helpers/schema.js';

const fieldSchema = z.object({
    label: z.string().min(1, 'Field label is required'),
    name: z.string().min(1, 'Field name is required'),
    short_description: z.string().optional().nullable(),
    field_type: z.enum([
        'text', 'textarea', 'email', 'password', 'url', 'tel', 'number', 'range',
        'select', 'checkbox', 'radio', 'date', 'datetime-local', 'time', 'month',
        'week', 'file', 'color', 'hidden'
    ]),
    group: z.string().optional().nullable(),
    required: z.boolean().default(false),
    options: z
        .array(
            z.object({
                label: z.string().min(1, 'Label is required'),
                value: z.string().min(1, 'Value is required'),
            })
        )
        .default([])
        .optional(),
    order: z.number().int().min(0),
});

export const dynamicFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    primary_color: z.string().min(1, 'Primary color is required').default('#673ab7'),
    description: z.string().optional().nullable(),
    enable_alerts: z.boolean().default(false),
    is_active: z.boolean().default(true),
    authenticated_only: z.boolean().default(false),
    require_captcha: z.boolean().default(false),
    expired_at: dateSchema('Expired Date', true),
    notification_emails: z
        .array(z.string().email('Must be a valid email'))
        .default([])
        .optional()
        .nullable(),
    fields: z.array(fieldSchema).min(1, 'At least one field is required'),
});