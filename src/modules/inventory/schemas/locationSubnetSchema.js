import * as z from "zod";

// Accepts:
// - 192.
// - 192.168.
// - 192.168.1.
// - 192.168.1.1
const subnetRegex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){0,3}\.?$/;

const locationSubnetSchema = z.object({
    location_id: z
        .number({ invalid_type_error: "Location is required" })
        .min(1, "Location is required"),

    ips: z
        .array(
            z.string()
                .min(2, "Invalid subnet or IP") // "x." or "x.x" minimum
                .max(15, "Invalid subnet or IP")
                .regex(subnetRegex, "Invalid subnet or IPv4 address")
        )
        .min(1, "At least one subnet/IP is required"),
});

export default locationSubnetSchema;
