import React from "react";
import FormButton from "@components/form/FormButton.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import useDarkModeForm from "@redux/common/useDarkModeForm.js";
import sapphirew from "@assets/images/company-logos/sapphirew.png";
import sapphireb from "@assets/images/company-logos/sapphireb.png";

const CouponInquiryForm = ({
                               dataAreaId,
                               setDataAreaId,
                               couponCode,
                               setCouponCode,
                               handleKeyDown,
                               handleSearch,
                               isLoading,
                               errorMessage,
                               couponInfoItems,
                               couponUsageItems,
                               dataAreaOptions,
                           }) => {
    const isDark = useDarkModeForm();
    const hasResults =
        (couponInfoItems && couponInfoItems.length > 0) ||
        (couponUsageItems && couponUsageItems.length > 0);

    // Map titles -> values for easier layout control
    const infoMap = React.useMemo(() => {
        const map = {};
        (couponInfoItems || []).forEach(({ title, value }) => {
            map[title] = value;
        });
        return map;
    }, [couponInfoItems]);

    const InfoCard = ({ label, value }) => (
        <div className="flex flex-col border rounded-lg p-4 bg-white dark:bg-bodybg">
            <span className="text-sm opacity-80">{label}</span>
            <span className="text-base font-semibold break-all">
        {value ?? "N/A"}
      </span>
        </div>
    );

    const formatGrossAmountNoSign = (value) => {
        if (value === null || value === undefined) return value;

        // row.grossAmount is already a formatted string (e.g. "-36,570")
        const str = String(value).trim();

        // remove only the leading "-" if present
        return str.replace(/^-/, "");
    };

    return (
        // full width on all breakpoints
        <div className="col-span-12">
            <div className="box">
                <div className="box-body">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Data Area LOV */}
                        <select
                            className="w-full md:flex-1 px-4 py-2 rounded-md form-control"
                            value={dataAreaId}
                            onChange={(e) => setDataAreaId(e.target.value)}
                        >
                            {dataAreaOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Coupon Code Input */}
                        <input
                            type="text"
                            placeholder="Enter Coupon Code"
                            className="w-full md:flex-1 px-4 py-2 form-control"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* Search Button */}
                        <div className="w-full md:w-auto">
                            <FormButton
                                isLoading={isLoading}
                                text="Search"
                                className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-md"
                                onClick={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Card */}
            <div className="flex flex-col items-stretch space-y-6 mt-10 mb-10 rounded-3xl">
                <div className="text-black p-6 rounded-3xl shadow-2xl w-full border bg-white dark:text-gray-200 dark:bg-bodybg">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <LoadingSpinner />
                        </div>
                    ) : errorMessage ? (
                        <div className="flex flex-col items-center space-y-3">
                            <img
                                src={isDark ? sapphirew : sapphireb}
                                alt="Logo"
                                className="h-10"
                            />
                            <p className="text-red-500 text-lg">{errorMessage}</p>
                        </div>
                    ) : !hasResults ? (
                        <div className="flex flex-col items-center space-y-3 text-center">
                            <img
                                src={isDark ? sapphirew : sapphireb}
                                alt="Logo"
                                className="h-10"
                            />
                            <p className="text-sm opacity-80">
                                Please search a coupon to view its details and usage information.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={isDark ? sapphirew : sapphireb}
                                    alt="Logo"
                                    className="h-10"
                                />
                            </div>

                            {/* Coupon Info as compact rows */}
                            {couponInfoItems && couponInfoItems.length > 0 && (
                                <div className="mb-6">
                                    <h5 className="text-lg font-semibold mb-4">Coupon Details</h5>

                                    {/* Row 1: Coupon Number, Coupon Code, Salesforce Id, Usage Limit, Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                        <InfoCard
                                            label="Coupon Number"
                                            value={infoMap["Coupon Number"]}
                                        />
                                        <InfoCard
                                            label="Coupon Code"
                                            value={infoMap["Coupon Code"]}
                                        />
                                        <InfoCard
                                            label="SalesForce Coupon Id"
                                            value={infoMap["SalesForce Coupon Id"]}
                                        />
                                        <InfoCard
                                            label="Usage Limit"
                                            value={infoMap["Usage Limit"]}
                                        />
                                        <InfoCard
                                            label="Status"
                                            value={infoMap["Status"]}
                                        />
                                    </div>

                                    {/* Row 2: Threshold Discount Limit, Discount Percentage, Discount Amount */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <InfoCard
                                            label="Threshold Discount Limit"
                                            value={infoMap["Threshold Discount Limit"]}
                                        />
                                        <InfoCard
                                            label="Discount Percentage"
                                            value={infoMap["Discount Percentage"]}
                                        />
                                        <InfoCard
                                            label="Discount Amount"
                                            value={infoMap["Discount Amount"]}
                                        />
                                    </div>

                                    {/* Row 3: Valid From, Valid To */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InfoCard
                                            label="Valid From"
                                            value={infoMap["Valid From"]}
                                        />
                                        <InfoCard
                                            label="Valid To"
                                            value={infoMap["Valid To"]}
                                        />
                                    </div>

                                    {/* Row 4: Description full width */}
                                    <div className="mt-2">
                                        <InfoCard
                                            label="Description"
                                            value={infoMap["Description"]}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* Coupon Usage as TABLE */}
                            {couponUsageItems && couponUsageItems.length > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-lg font-semibold">Coupon Usage</h5>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                      {couponUsageItems.length} entr
                                            {couponUsageItems.length === 1 ? "y" : "ies"}
                    </span>
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-primary text-white">
                                            <tr>

                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Receipt Id
                                                </th>

                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Store Name
                                                </th>

                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Sales Id
                                                </th>

                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Trans Date
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide">
                                                    Disc Amount
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide">
                                                    Gross Amount
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Staff Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                    Sales Rep Name
                                                </th>
                                            </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {couponUsageItems.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-bodybg dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >

                                                    <td className="px-4 py-2">{row.receiptId}</td>

                                                    <td className="px-4 py-2">{row.storeName}</td>

                                                    <td className="px-4 py-2">{row.salesId}</td>

                                                    <td className="px-4 py-2">{row.transDate}</td>
                                                    <td className="px-4 py-2 text-center font-medium">
                                                        {row.discAmount}
                                                    </td>
                                                    <td className="px-4 py-2 text-center font-medium">
                                                        {formatGrossAmountNoSign(row.grossAmount)}
                                                    </td>

                                                    <td className="px-4 py-2">{row.staffName}</td>
                                                    <td className="px-4 py-2">{row.salesRepName}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponInquiryForm;
