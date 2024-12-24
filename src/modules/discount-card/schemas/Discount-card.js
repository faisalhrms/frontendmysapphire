import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

// Function to fetch discount card data
export const fetchDiscountCardData = async (cardNo) => {
    try {
        const response = await api.get(`/get-discount-data/?card_no=${cardNo}`);
        Notify.success("Discount card data fetched successfully!");
        return response.data.data[0]; // Return the first object from the data array
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to fetch discount card data.");
        return null;
    }
};

// Static discount card schema
export const discountCardSchema = {
    Name: "Kashif Hussain",
    Account_Number: "SRL12032522124",
    Customer_Group: "CG008",
    Remaining_Quantity: 0.0,
    Remaining_Value: 8750.0,
    Remaining_Value_x4: 35000,
    Card_No: "SRL-2024-246-81002897",
    Email: "",
    Total_Value: 8750.0,
    Total_Value_x4: 35000,
    Limit_Type: "Monthly",
    Blocked: "No",
};


export const fetchStaticDiscountData = async () => {
    try {
      
        const staticData = {
            data: [discountCardSchema],
            errors: {},
            status: true,
            message: "Operation successful",
        };
        Notify.success(staticData.message);
        return staticData.data[0];
    } catch (error) {
        Notify.error("Error fetching static discount data.");
        return null;
    }
};
