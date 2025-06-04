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
    total_experience_years: z.string().min(0, "Total experience must be non-negative"),
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
    cnic: z.string().nonempty("CNIC is required"),
    date_of_birth: dateSchema('Date of Birth', true),
    mobile_number: z.string().nonempty("Mobile number is required"),
    email: z.string().email("Invalid email address"),
    status: applicantStatus.default("pending"),
    remarks: z.string().max(500).optional(),
    home_address: z.string().max(1000).optional(),
    city: z.string().nonempty("City is required"),

    qualification_set: z.array(qualificationSchema).optional(),
    experience_set: z.array(experienceSchema).optional(),
    referral_set: z.array(referralSchema).optional(),

    recommendation_ids: z.array(z.number()).min(1, "At least one recommendation is required"),

    attachment_ids: z.array(z.number().min(1)).optional(),

    created_by_location_id: z.number().min(1, "Created by location is required"),
    preferred_store_location_id: z.number().min(1, "Preferred store location is required").optional(),
});

export default applicantSchema;
