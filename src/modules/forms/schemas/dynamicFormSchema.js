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
    unique: z.boolean().default(false),
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
    image: z.number().optional().nullable(),
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
    enable_coupon: z.boolean().default(false),
    need_approval: z.boolean().default(false),
    coupon_config: z.coerce.number().optional().nullable(),
    coupon_type: z.enum(['Simple', 'Threshold']).optional().nullable(),
    coupon_discount_type: z.enum(['Amount', 'Percentage']).optional().nullable(),
    coupon_discount_amount: z.coerce.number().optional().nullable(),
    coupon_min_order_value: z.coerce.number().optional().nullable(),
    coupon_valid_days: z.coerce.number().int().positive().default(7),
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

    if (data.enable_coupon) {
        if (!data.need_approval) {
            ctx.addIssue({
                path: ['need_approval'],
                code: z.ZodIssueCode.custom,
                message: 'Approval is required if coupon discount is active',
            });
        }
        if (!data.coupon_config) {
            ctx.addIssue({
                path: ['coupon_config'],
                code: z.ZodIssueCode.custom,
                message: 'Coupon country/area is required',
            });
        }
        if (!data.coupon_type) {
            ctx.addIssue({
                path: ['coupon_type'],
                code: z.ZodIssueCode.custom,
                message: 'Coupon type is required',
            });
        }
        if (!data.coupon_discount_type) {
            ctx.addIssue({
                path: ['coupon_discount_type'],
                code: z.ZodIssueCode.custom,
                message: 'Coupon Discount type is required',
            });
        }
        if (!data.coupon_discount_amount) {
            ctx.addIssue({
                path: ['coupon_discount_amount'],
                code: z.ZodIssueCode.custom,
                message: 'Coupon Discount amount/percentage is required',
            });
        }
        if (!data.coupon_valid_days) {
            ctx.addIssue({
                path: ['coupon_valid_days'],
                code: z.ZodIssueCode.custom,
                message: 'Coupon Validity in days is required',
            });
        }
        if (data.coupon_type === 'Threshold' && !data.coupon_min_order_value) {
            ctx.addIssue({
                path: ['coupon_min_order_value'],
                code: z.ZodIssueCode.custom,
                message: 'Minimum order value is required for Threshold based discount',
            });
        }
    }
})
