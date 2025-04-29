
// src/modules/email/hooks/useSendEmailHook.js
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmail } from "@modules/setup/services/sendEmailService.js";
import { sendEmailSchema } from "@modules/setup/schemas/sendEmailSchema.js";

/**
 * Hook to manage SendEmail form
 */
export const useSendEmailForm = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(sendEmailSchema),
        defaultValues: {
            date: new Date().toISOString().slice(0, 10),
            type: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await sendEmail(data);
            navigate(-1); // go back or to a success page
        } catch (err) {
            console.error("Send email error:", err);
        }
    };

    return { control, errors, isSubmitting, handleSubmit, onSubmit };
};