import { z } from 'zod';
import { dateSchema } from '@helpers/schema.js';

const socialLinkSchema = z.object({
    platform: z.enum([
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'whatsapp',
        'youtube',
        'telegram',
        'website',
        'other',
    ], {
        required_error: 'Platform is required'
    }),
    url: z.string().url('Must be a valid URL'),
});


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
    font_family: z
        .string()
        .min(1, 'Font family is required')
        .default('Inter, sans-serif'),
    description: z.string().optional().nullable(),
    success_message: z
        .string()
        .optional()
        .default("Thank you for your submission! We have received your form successfully."),
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
    social_links: z.array(socialLinkSchema).optional().default([]),
    send_email_to_submitter: z.boolean().default(false),
    email_subject: z.string().optional().nullable(),
    email_content: z.string().optional().nullable(),
    enable_birthday_gift: z.boolean().default(false),
    birthday_coupon_type: z.enum(['fixed', 'percentage_threshold', 'percentage']).optional().nullable(),
    birthday_discount_amount: z.coerce.number().optional().nullable(),
    birthday_min_order_value: z.coerce.number().optional().nullable(),
    birthday_coupon_valid_days: z.coerce.number().int().positive().default(7),
    enable_anniversary_voucher: z.boolean().default(false),
    anniversary_coupon_type: z.enum(['fixed', 'percentage_threshold', 'percentage']).optional().nullable(),
    anniversary_discount_amount: z.coerce.number().optional().nullable(),
    anniversary_min_order_value: z.coerce.number().optional().nullable(),
    anniversary_coupon_valid_days: z.coerce.number().int().positive().default(7),
}).superRefine((data, ctx) => {
    if (data.send_email_to_submitter) {
        if (!data.email_subject || data.email_subject.trim() === '') {
            ctx.addIssue({
                path: ['email_subject'],
                code: z.ZodIssueCode.custom,
                message: 'Subject is required when email is enabled for submitter',
            });
        }
        if (!data.email_content || data.email_content.trim() === '') {
            ctx.addIssue({
                path: ['email_content'],
                code: z.ZodIssueCode.custom,
                message: 'Content is required when email is enabled for submitter',
            });
        }
    }

    if (data.enable_birthday_gift) {
        if (!data.birthday_coupon_type) {
            ctx.addIssue({
                path: ['birthday_coupon_type'],
                code: z.ZodIssueCode.custom,
                message: 'Birthday coupon type is required',
            });
        }
        if (!data.birthday_discount_amount) {
            ctx.addIssue({
                path: ['birthday_discount_amount'],
                code: z.ZodIssueCode.custom,
                message: 'Birthday discount amount is required',
            });
        }
        if (data.birthday_coupon_type === 'percentage_threshold' && !data.birthday_min_order_value) {
            ctx.addIssue({
                path: ['birthday_min_order_value'],
                code: z.ZodIssueCode.custom,
                message: 'Minimum order value is required for threshold-based birthday discount',
            });
        }
    }

    if (data.enable_anniversary_voucher) {
        if (!data.anniversary_coupon_type) {
            ctx.addIssue({
                path: ['anniversary_coupon_type'],
                code: z.ZodIssueCode.custom,
                message: 'Anniversary coupon type is required',
            });
        }
        if (!data.anniversary_discount_amount) {
            ctx.addIssue({
                path: ['anniversary_discount_amount'],
                code: z.ZodIssueCode.custom,
                message: 'Anniversary discount amount is required',
            });
        }
        if (data.anniversary_coupon_type === 'percentage_threshold' && !data.anniversary_min_order_value) {
            ctx.addIssue({
                path: ['anniversary_min_order_value'],
                code: z.ZodIssueCode.custom,
                message: 'Minimum order value is required for threshold-based anniversary discount',
            });
        }
    }
})
