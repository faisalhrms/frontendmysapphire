import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedExtensions = ['.xls', '.xlsx'];

const uploadProjectSchema = z.object({
    file: z.instanceof(File)
        .refine((file) => allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext)), {
            message: `Invalid file type. Only ${allowedExtensions.join(", ")} files are allowed.`,
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        }),
});

export default uploadProjectSchema;