import { useCallback, useState } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "0";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
};

const formatDateTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const useCouponInquiry = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [couponInfoItems, setCouponInfoItems] = useState([]);
    const [couponUsageItems, setCouponUsageItems] = useState([]); // table rows
    const [errorMessage, setErrorMessage] = useState("");

    const inquireCoupon = useCallback(async (dataAreaId, couponCode) => {
        setIsLoading(true);
        setErrorMessage("");
        setCouponInfoItems([]);
        setCouponUsageItems([]);

        try {
            const params = {
                data_area_id: dataAreaId,
                coupon_code: couponCode,
            };

            // single endpoint now
            const response = await api.get("/coupon-inquiry/info/", { params });

            const infoData = response?.data?.data?.info || null;     // object
            const usageLines = response?.data?.data?.usages || [];   // array

            if ((!usageLines || usageLines.length === 0) && !infoData) {
                setErrorMessage("No coupon data found for the provided code.");
                return;
            }

            // -------- Coupon Usage -> table rows -------- //
            if (Array.isArray(usageLines) && usageLines.length > 0) {
                const mappedUsageRows = usageLines.map((line, index) => ({
                    id: `${line.TransactionId || ""}-${index}`,
                    couponCode: line.CouponCode || "N/A",
                    receiptId: line.ReceiptId || "N/A",
                    storeId: line.StoreId || "N/A",
                    storeName: line.StoreName || "N/A",
                    replCounter: line.ReplCounter ?? "N/A",
                    salesId: line.SalesId || "N/A",
                    transactionId: line.TransactionId || "N/A",
                    transDate: formatDateTime(line.TransDate),
                    discAmount: formatNumber(line.DiscAmount),
                    grossAmount: formatNumber(line.GrossAmount),
                    staffName: line.StaffName || "N/A",
                    salesRepName: line.SalesRepName || "N/A",
                }));

                setCouponUsageItems(mappedUsageRows);
            }

            // -------- Coupon Info -> card data -------- //
            if (infoData) {
                setCouponInfoItems([
                    {
                        title: "Coupon Number",
                        value: infoData.CouponNumber || "N/A",
                    },
                    {
                        title: "Coupon Code",
                        value: infoData.CouponCode || "N/A",
                    },
                    {
                        title: "Description",
                        value: infoData.Description || "N/A",
                    },
                    {
                        title: "Threshold Discount Limit",
                        value: formatNumber(infoData.ThresholdDiscountLimit),
                    },
                    {
                        title: "Discount Percentage",
                        value: `${Math.round(infoData.DiscountPercentage || 0)}%`,
                    },
                    {
                        title: "Discount Amount",
                        value: formatNumber(infoData.DiscountAmount),
                    },
                    {
                        title: "SalesForce Coupon Id",
                        value: infoData.SalesForce_Coupon_Id || "N/A",
                    },
                    {
                        title: "Status",
                        value: infoData.Status || "N/A",
                    },
                    {
                        title: "Usage Limit",
                        value: infoData.UsageLimit ?? "N/A",
                    },
                    {
                        title: "Valid From",
                        value: formatDateTime(infoData.ValidFrom),
                    },
                    {
                        title: "Valid To",
                        value: formatDateTime(infoData.ValidTo),
                    },
                ]);
            }
        } catch (error) {
            console.error("Coupon inquiry failed:", error);
            const msg =
                error?.response?.data?.message ||
                "Failed to fetch coupon inquiry data.";
            Notify.error(msg);
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        errorMessage,
        couponInfoItems,
        couponUsageItems,
        inquireCoupon,
    };
};
