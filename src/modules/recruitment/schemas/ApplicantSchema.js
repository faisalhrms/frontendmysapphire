import { z } from "zod";
import { dateSchema } from "@helpers/schema.js";

// Define ApplicantStatus as enum
const applicantStatus = z.enum(["submitted", "blacklist", "park_for_the_role","not_recommended","recommended"]);

// Nested schemas
const qualificationSchema = z.object({
    level: z.string().nonempty("Education level is required"),
    institution: z.string().nonempty("Institution name is required"),
    years_completed: z.number().min(0, "Years completed must be non-negative"),
});

const experienceSchema = z.object({
    company_name: z.string().nonempty("Company name is required"),
    designation: z.string().nonempty("Designation is required"),
    years_in_role: z.string().min(0, "Years in role must be non-negative"),
});

const referralSchema = z.object({
    referrer_name: z.string().nonempty("Referrer name is required"),
    referrer_designation: z.string().nonempty("Referrer designation is required"),
    referrer_store_location_id: z.number().min(1, "Referrer store location is required"),
});

// Main Applicant schema
const applicantSchema = z.object({
    full_name: z.string().nonempty("Full name is required"),
    father_name: z.string().nonempty("Father name is required"),
    cnic: z
        .string()
        .nonempty("CNIC is required")
        .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in the format 00000-0000000-0"),
    date_of_birth: dateSchema('Date of Birth', true).refine((dateStr) => {
        if (!dateStr || typeof dateStr !== "string") return false;

        const inputDate = new Date(dateStr);
        if (isNaN(inputDate.getTime())) return false; // invalid date

        const today = new Date();
        const minAllowedDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

        return inputDate < minAllowedDate;
    }, {
        message: "Date of Birth must be at least 15 years before today",
    }),

    total_experience_years: z
        .string({
            required_error: "Total experience is required",
            invalid_type_error: "Total experience must be a string",
        })
        .min(0, "Total experience must be non-negative"),

    referred_by: z.string().optional(),
    referred_by_designation: z.string().optional(),

    mobile_number: z
        .string()
        .nonempty("Mobile number is required")
        .regex(/^03\d{2}-\d{7}$/, "Mobile number must be in the format 0300-0000000"),
    email: z.string().email("Invalid email address"),
    status: applicantStatus.default("pending"),
    remarks: z.string().max(500).optional(),
    home_address: z.string().max(1000).optional(),
    city: z.string().nonempty("City is required"),

    qualification_set: z.array(qualificationSchema).optional(),
    experience_set: z.array(experienceSchema).optional(),
    referral_set: z.array(referralSchema).optional(),

    recommended_position_id: z.number().min(1, "Recommendation id is required"),

    attachment_ids: z.array(z.number().min(1)).optional(),

    created_by_location_id: z.number().min(1, "Created by location is required"),
    preferred_store_location_id: z.number().min(1, "Preferred store location is required").optional(),
});

export default applicantSchema;
