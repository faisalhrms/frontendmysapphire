import * as z from "zod";

const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

const locationSubnetSchema = z.object({
    location_id: z
        .number({ invalid_type_error: "Location is required" })
        .min(1, "Location is required"),

    ips: z
        .array(
            z
                .string()
                .min(7, "Invalid IP address") // shortest valid: 0.0.0.0
                .max(15, "Invalid IP address") // longest valid: 255.255.255.255
                .regex(ipv4Regex, "Invalid IPv4 address") // ✅ Regex-based IPv4 validation
        )
        .min(1, "At least one IP is required"),
});

export default locationSubnetSchema;