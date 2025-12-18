import React, { useState } from "react";
import { TicketPercent } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CouponInquiryForm from "../components/CouponInquiryForm.jsx";
import { useCouponInquiry } from "../hooks/useCouponInquiry.js";

const DATA_AREA_OPTIONS = [
    { value: "SRL", label: "Pakistan" },
    { value: "SUK", label: "United Kingdom" },
    { value: "SUAE", label: "United Arab Emirates" },
];


const CouponInquiryPage = () => {
    const [dataAreaId, setDataAreaId] = useState("SRL");
    const [couponCode, setCouponCode] = useState("");
    const [localError, setLocalError] = useState("");

    const {
        isLoading,
        errorMessage,
        couponInfoItems,
        couponUsageItems,
        inquireCoupon,
    } = useCouponInquiry();

    const handleSearch = () => {
        if (!couponCode?.trim()) {
            setLocalError("Coupon code is required.");
            return;
        }
        setLocalError("");
        inquireCoupon(dataAreaId, couponCode.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    const mergedError = localError || errorMessage;

    return (
        <>
            <IconPageHeader
                heading="Coupon Inquiry"
                description="Search coupon details and usage across different regions."
                icon={TicketPercent}
            />

            <CouponInquiryForm
                dataAreaId={dataAreaId}
                setDataAreaId={setDataAreaId}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleKeyDown={handleKeyDown}
                handleSearch={handleSearch}
                isLoading={isLoading}
                errorMessage={mergedError}
                couponInfoItems={couponInfoItems}
                couponUsageItems={couponUsageItems}
                dataAreaOptions={DATA_AREA_OPTIONS}
            />
        </>
    );
};

export default CouponInquiryPage;
