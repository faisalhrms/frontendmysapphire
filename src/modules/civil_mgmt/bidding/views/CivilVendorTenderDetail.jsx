import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    AlertTriangle,
    Calculator,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Grid3X3,
    HardDrive,
    Hash,
    Loader2,
    MapPin,
    Package2,
    Save,
    Send,
    Target,
    XCircle,
    Paperclip,
    FileText,
    Eye
} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";

import PdfModalViewer from "@modules/policies/components/PdfModalViewer.jsx";
import {useSecureFileViewer} from "@modules/media/hooks/mediaHooks.js";


const ItemRow = React.memo(({
                                item,
                                index,
                                vendorRate,
                                vendorAmount,
                                hasError,
                                onRateChange,
                                formatAmountWithCommas
                            }) => {
    const handleInputChange = useCallback((e) => {
        onRateChange(item.id, e.target.value, item.quantity);
    }, [item.id, item.quantity, onRateChange]);

    return (
        <tr className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 text-sm font-semibold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    {index + 1}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded-lg border">
                        <Hash size={12} />
                        {item.item_no}
                    </div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                    {item.unit}
                </span>
            </td>
            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                {item.quantity.toLocaleString()}
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="text-xs text-gray-500 text-right">
                        Original: PKR {formatAmountWithCommas(item.rate)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 whitespace-nowrap">Your Rate:</span>
                        <input
                            type="number"
                            value={vendorRate}
                            onChange={handleInputChange}
                            placeholder="Enter rate"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                                hasError
                                    ? "!border-red"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        />
                    </div>
                    {hasError && (
                        <div className="text-xs text-red text-center mt-1">
                            Rate is required
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-right space-y-1">
                    <div className="text-xs text-gray-500">
                        Original: PKR {formatAmountWithCommas(item.amount)}
                    </div>
                    <div className={`font-bold ${vendorAmount > 0 ? "text-blue-600" : "text-gray-400"}`}>
                        PKR {formatAmountWithCommas(vendorAmount)}
                    </div>
                </div>
            </td>
        </tr>
    );
});

const FileItem = React.memo(({ fileId, onView, type, index }) => {
    const getFileIcon = (type) => {
        if (type === 'Drawing') {
            return <Grid3X3 size={16} className="text-gray-500" />;
        } else {
            return <FileText size={16} className="text-gray-500" />;
        }
    };

    return (
        <div
            onClick={() => onView(fileId)}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer group"
        >
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                {getFileIcon(type)}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">
                    {type} {index + 1}
                </span>
            </div>
            <Eye size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});

FileItem.displayName = 'FileItem';

ItemRow.displayName = 'ItemRow';

const CivilVendorTenderDetail = () => {
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitNotes, setSubmitNotes] = useState("");
    const [vendorRates, setVendorRates] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [inputErrors, setInputErrors] = useState({});

    const { id } = useParams();
    const { fileState, showFile, hideFile } = useSecureFileViewer();

    const { data: boqData, isLoading, error } = useQuery({
        queryKey: ["civil-vendor-tender-detail", id],
        queryFn: async () => {
            const { data } = await api.get(`/civil/vendor/tenders/${id}/`);
            return data.data;
        },
        enabled: !!id,
        cacheTime: 0,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const isSubmitting = false;

    // Stable reference for formatAmountWithCommas
    const formatAmountWithCommas = useCallback((amount) => {
        return new Intl.NumberFormat("en-PK").format(amount);
    }, []);

    useEffect(() => {
        if (boqData?.boq?.items) {
            const initialRates = {};
            const initialErrors = {};
            boqData.boq.items.forEach((item) => {
                initialRates[item.id] = { rate: "", amount: 0 };
                initialErrors[item.id] = false;
            });
            setVendorRates(initialRates);
            setInputErrors(initialErrors);
        }
    }, [boqData?.boq?.items]);

    // Stable rate change handler - this is the key fix
    const handleRateChange = useCallback((itemId, newRate, quantity) => {
        const rate = parseFloat(newRate) || 0;
        const amount = rate * quantity;
        const isEmpty = !newRate || newRate.trim() === "";

        // Batch state updates to prevent multiple re-renders
        setVendorRates((prev) => ({
            ...prev,
            [itemId]: { rate: newRate, amount },
        }));

        setInputErrors((prev) => ({
            ...prev,
            [itemId]: isEmpty,
        }));

        setHasUnsavedChanges(true);
    }, []); // Empty dependency array since we're using functional updates

    const calculateTotalAmount = useMemo(() => {
        return Object.values(vendorRates).reduce(
            (total, item) => total + (item.amount || 0),
            0
        );
    }, [vendorRates]);

    // Validation function to check if all rates are filled
    const validateAllRates = useCallback(() => {
        if (!boqData?.boq?.items) return true;

        const errors = {};
        let hasErrors = false;

        boqData.boq.items.forEach((item) => {
            const rate = vendorRates[item.id]?.rate || "";
            const isEmpty = !rate || rate.trim() === "";
            errors[item.id] = isEmpty;
            if (isEmpty) hasErrors = true;
        });

        setInputErrors(errors);
        return !hasErrors;
    }, [boqData?.boq?.items, vendorRates]);

    const handleSaveRates = useCallback(() => {
        if (validateAllRates()) {
            console.log("Saving rates:", vendorRates);
            setHasUnsavedChanges(false);
        } else {
            alert("Please fill in all rate fields before saving.");
        }
    }, [vendorRates, validateAllRates]);

    const handleSubmitTender = useCallback(() => {
        if (validateAllRates()) {
            console.log("Submitting tender with rates:", {
                notes: submitNotes,
                vendorRates,
            });
            setShowSubmitModal(false);
        } else {
            alert("Please fill in all rate fields before submitting.");
        }
    }, [submitNotes, vendorRates, validateAllRates]);

    const getDaysRemaining = useCallback(() => {
        if (!boqData?.ended_at) return null;
        const endDate = new Date(boqData.ended_at);
        const now = new Date();
        const diffTime = endDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [boqData?.ended_at]);

    const getStatusColor = useCallback((status) => {
        switch (status) {
            case "open":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "closed":
                return "bg-red-50 text-red-700 border-red-200";
            case "submitted":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    }, []);

    // Memoize these calculations
    const daysRemaining = useMemo(() => getDaysRemaining(), [getDaysRemaining]);
    const isExpired = useMemo(() => daysRemaining !== null && daysRemaining < 0, [daysRemaining]);
    const canSubmit = useMemo(() =>
            boqData?.is_submit_able && !isExpired && boqData?.status === "open",
        [boqData?.is_submit_able, boqData?.status, isExpired]
    );

    // Memoized StatusBadge component
    const StatusBadge = React.memo(({ status }) => (
        <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                status
            )}`}
        >
            <div
                className={`w-2 h-2 rounded-full ${
                    status === "open"
                        ? "bg-emerald-500"
                        : status === "closed"
                            ? "bg-red-500"
                            : "bg-blue-500"
                }`}
            ></div>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
    ));

    StatusBadge.displayName = 'StatusBadge';

    // Memoized StatCard component
    const StatCard = React.memo(({ icon, label, value, sublabel, trend }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 text-primary bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {icon}
                </div>
                {trend && (
                    <div className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
                        {trend}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">{label}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
            </div>
        </div>
    ));

    StatCard.displayName = 'StatCard';

    // Memoized table rows
    const tableRows = useMemo(() => {
        if (!boqData?.boq?.items) return [];

        return boqData.boq.items.map((item, index) => (
            <ItemRow
                key={item.id}
                item={item}
                index={index}
                vendorRate={vendorRates[item.id]?.rate || ""}
                vendorAmount={vendorRates[item.id]?.amount || 0}
                hasError={inputErrors[item.id]}
                onRateChange={handleRateChange}
                formatAmountWithCommas={formatAmountWithCommas}
            />
        ));
    }, [boqData?.boq?.items, vendorRates, inputErrors, handleRateChange, formatAmountWithCommas]);

    const FilesSection = React.memo(({ title, fileIds, icon, emptyMessage, type }) => {
        if (!fileIds || fileIds.length === 0) {
            return (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <p className="text-gray-600">Project {type.toLowerCase()}</p>
                        </div>
                    </div>
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                            {icon}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No {title} Available</h4>
                        <p className="text-gray-600">{emptyMessage}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <p className="text-gray-600">{fileIds.length} {type.toLowerCase()}{fileIds.length !== 1 ? 's' : ''} available</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                        <Paperclip size={16} />
                        <span className="font-semibold">{fileIds.length} Files</span>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fileIds.map((fileId, index) => (
                            <FileItem
                                key={fileId}
                                fileId={fileId}
                                index={index}
                                onView={showFile}
                                type={type}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    });

    FilesSection.displayName = 'FilesSection';

    const SubmitModal = React.memo(() => {
        if (!showSubmitModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Send size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Submit Tender</h3>
                        </div>
                        <p className="text-gray-600">Review your proposal before submission</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Proposal Summary</h4>
                            <div className="text-sm text-blue-800">
                                <div className="flex justify-between mb-1">
                                    <span>Total Items:</span>
                                    <span className="font-semibold">{boqData?.boq?.items?.length || 0}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Your Total Amount:</span>
                                    <span className="font-bold">
                                        PKR {formatAmountWithCommas(calculateTotalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Original Amount:</span>
                                    <span>PKR {formatAmountWithCommas(boqData?.boq?.total_amount || 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={submitNotes}
                                onChange={(e) => setSubmitNotes(e.target.value)}
                                placeholder="Add any additional comments or notes for your submission..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-amber-900">Important Notice</h4>
                                    <p className="text-sm text-amber-800 mt-1">
                                        Once submitted, you cannot modify your rates or tender. Please review all details carefully.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                        <button
                            onClick={() => setShowSubmitModal(false)}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitTender}
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Confirm Submit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    });

    SubmitModal.displayName = 'SubmitModal';

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return <EmptyState icon={XCircle} heading="Unable to Load BOQ" description={error?.message} />;
    if (!boqData)
        return <EmptyState icon={Package2} heading="BOQ Not Found" description="The requested BOQ could not be located in our system" />;

    return (
        <div>
            <IconPageHeader
                heading={<h1 className="text-3xl font-bold">{boqData.title}</h1>}
                description={
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} />
                        <span className="text-gray-500">{boqData.boq?.site?.name}</span>
                        <span>→</span>
                        <span className="text-gray-600">{boqData.boq?.project?.name}</span>
                    </div>
                }
                icon={HardDrive}
                children={
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                                {new Date(boqData.started_at).toLocaleDateString()} -{" "}
                                {new Date(boqData.ended_at).toLocaleDateString()}
                            </span>
                        </div>
                        <StatusBadge status={boqData.status} />
                    </div>
                }
            />

            <div className="mx-auto pb-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Package2 size={24}/>}
                        label="Total Items"
                        value={boqData.boq?.items?.length || 0}
                        sublabel="Construction items"
                    />
                    <StatCard
                        icon={<DollarSign size={24}/>}
                        label="Original Amount"
                        value={`PKR ${formatAmountWithCommas(boqData.boq?.total_amount || 0)}`}
                        sublabel="Project cost"
                    />
                    <StatCard
                        icon={<Target size={24}/>}
                        label="Your Amount"
                        value={`PKR ${formatAmountWithCommas(calculateTotalAmount)}`}
                        sublabel="Your proposal"
                    />
                    <StatCard
                        icon={<Clock size={24}/>}
                        label="Days Remaining"
                        value={daysRemaining !== null ? (isExpired ? "Expired" : daysRemaining) : "N/A"}
                        sublabel="Until deadline"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FilesSection
                        title="Project Drawings"
                        fileIds={boqData.boq.project_drawing_files || []}
                        icon={<Grid3X3 size={20}/>}
                        emptyMessage="No project drawings have been uploaded for this tender."
                        type="Drawing"
                    />

                    <FilesSection
                        title="Tender Attachments"
                        fileIds={boqData.attachments || []}
                        icon={<Paperclip size={20}/>}
                        emptyMessage="No tender attachments have been uploaded for this tender."
                        type="Document"
                    />
                </div>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 space-y-8">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div
                                className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        <Grid3X3 size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">BOQ Items - Enter Your
                                            Rates</h3>
                                        <p className="text-gray-600">Enter your competitive rates for each construction
                                            item</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {hasUnsavedChanges && (
                                        <button
                                            onClick={handleSaveRates}
                                            className="text-success bg-success/10 hover:bg-success hover:text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Save size={18}/>
                                            Save Rates
                                        </button>
                                    )}

                                    {canSubmit && (
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            className="text-primary bg-primary/10 hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Send size={20}/>
                                            Submit Tender
                                        </button>
                                    )}

                                    {!canSubmit && (
                                        <div
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg border">
                                            {isExpired ? <AlertTriangle size={18}/> : <CheckCircle size={18}/>}
                                            <span className="font-medium">
                                                {isExpired ? "Submission Closed" : boqData.status !== "open" ? "Tender Closed" : "Not Submittable"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {boqData.boq?.items?.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Item
                                                    Details
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Unit</th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Rate</th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                            {tableRows}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div
                                        className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div
                                                className="flex items-center gap-6 px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                                                        <Calculator size={20}/>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-gray-900">Original
                                                            Total
                                                        </div>
                                                        <div className="text-sm text-gray-500">Project estimate</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-600">
                                                    PKR {formatAmountWithCommas(boqData.boq?.total_amount || 0)}
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center gap-6 px-6 py-4 bg-white border-2 border-blue-300 rounded-xl shadow-lg">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-lg flex items-center justify-center">
                                                        <Target size={20}/>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-blue-900">Your Total
                                                        </div>
                                                        <div className="text-sm text-blue-600">Your proposal</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    PKR {formatAmountWithCommas(calculateTotalAmount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-16 text-center">
                                    <div
                                        className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <Package2 className="w-10 h-10 text-gray-400"/>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Items Found</h4>
                                    <p className="text-gray-600">This tender doesn't have any BOQ items yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SubmitModal/>
            <PdfModalViewer
                isOpen={fileState.isVisible}
                fileId={fileState.fileId}
                onClose={hideFile}
            />
        </div>
    );
};

export default CivilVendorTenderDetail;