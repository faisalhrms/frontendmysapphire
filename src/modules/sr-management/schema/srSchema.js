import { z } from "zod";

const yearlyDashboard = z.enum(["2024", "2025"], {
    errorMap: () => "Year must be '2024' or '2025'",
});
const monthDashboard = z.enum(["'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'"], {
    errorMap: () => "Year must be 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov' or 'Dec' ",
});

const srSchema = z.object( {
    name: "sr",
    yearly_dashboard: yearlyDashboard.optional(),
    month_dashboard: yearlyDashboard.optional(),
});

export default srSchema;