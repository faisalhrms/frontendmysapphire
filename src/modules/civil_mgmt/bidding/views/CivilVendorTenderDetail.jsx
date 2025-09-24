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
    Send,
    Target,
    XCircle,
    Paperclip,
    FileText,
    Eye,
    MessageSquare
} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";

import PdfModalViewer from "@modules/policies/components/PdfModalViewer.jsx";
import {useSecureFileViewer} from "@modules/media/hooks/mediaHooks.js";
import BoqStatCard from "@modules/civil_mgmt/boq/components/BoqStatCard.jsx";
import Notify from "@helpers/toastNotifications.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";

const ItemRow = React.memo(({
                                item,
                                index,
                                vendorRate,
                                vendorAmount,
                                hasError,
                                onRateChange,
                                formatAmountWithCommas,
                                currency,
                                isReadOnly = false
                            }) => {
    const handleInputChange = useCallback((e) => {
        if (!isReadOnly) {
            onRateChange(item.id, e.target.value, item.quantity);
        }
    }, [item.id, item.quantity, onRateChange, isReadOnly]);

    return (
        <tr className="border-b border-gray-50 hover:bg-primary/10 transition-colors group">
            <td className="px-6 py-4">
                <div className="w-8 h-8 bg-primary/10 text-primary text-sm font-medium rounded flex items-center justify-center">
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
                <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-blue-200">
                    {item.unit}
                </span>
            </td>
            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                {item.quantity.toLocaleString()}
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="text-xs text-gray-500 text-right">
                        Original: {currency} {formatAmountWithCommas(item.rate)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                            {isReadOnly ? "Your Rate:" : "Your Rate:"}
                        </span>
                        {isReadOnly ? (
                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900">
                                {formatAmountWithCommas(vendorRate || 0)}
                            </div>
                        ) : (
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
                        )}
                    </div>
                    {hasError && !isReadOnly && (
                        <p className="text-xs text-red text-center mt-1">
                            Rate is required
                        </p>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-right space-y-1">
                    <div className="text-xs text-gray-500">
                        Original: {currency} {formatAmountWithCommas(item.amount)}
                    </div>
                    <div className={`font-bold ${vendorAmount > 0 ? "text-blue-600" : "text-gray-400"}`}>
                        {currency} {formatAmountWithCommas(vendorAmount)}
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
    const [vendorRates, setVendorRates] = useState([]);
    const [inputErrors, setInputErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Check if tender is already submitted
    const isSubmitted = useMemo(() => boqData?.status === "submitted", [boqData?.status]);

    useEffect(() => {
        if (boqData?.tender?.boq?.items) {
            if (isSubmitted && boqData?.items) {
                // If submitted, use the submitted vendor rates
                const submittedRates = boqData.tender.boq.items.map(boqItem => {
                    const submittedItem = boqData.items.find(item => item.item_id === boqItem.id);
                    return {
                        item: boqItem.id,
                        rate: submittedItem?.rate || 0,
                        amount: submittedItem?.amount || 0
                    };
                });
                setVendorRates(submittedRates);
            } else {
                // If not submitted, initialize empty rates
                const initialRates = boqData.tender.boq.items.map(item => ({
                    item: item.id,
                    rate: "",
                    amount: 0
                }));
                setVendorRates(initialRates);

                const initialErrors = {};
                boqData.tender.boq.items.forEach((item) => {
                    initialErrors[item.id] = false;
                });
                setInputErrors(initialErrors);
            }
        }
    }, [boqData?.tender.boq?.items, boqData?.items, isSubmitted]);

    const handleRateChange = useCallback((itemId, rate, quantity) => {
        if (isSubmitted) return; // Don't allow changes if submitted

        const parsedRate = parseFloat(rate) || 0;
        const amount = +(parsedRate * quantity).toFixed(2);

        setVendorRates(prev => {
            const existingIndex = prev.findIndex(r => r.item === itemId);

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = { item: itemId, rate: parsedRate, amount };
                return updated;
            } else {
                return [...prev, { item: itemId, rate: parsedRate, amount }];
            }
        });

        setInputErrors(prev => ({
            ...prev,
            [itemId]: parsedRate <= 0
        }));
    }, [isSubmitted]);

    const calculateTotalAmount = useMemo(() => {
        return vendorRates.reduce((total, item) => total + (item.amount || 0), 0);
    }, [vendorRates]);

    const allRatesFilled = useMemo(() => {
        if (!boqData?.tender.boq?.items) return false;
        if (isSubmitted) return true; // If submitted, consider all rates filled

        return boqData.tender.boq.items.every(item => {
            const vendorRate = vendorRates.find(vr => vr.item === item.id);
            return vendorRate && vendorRate.rate > 0;
        });
    }, [boqData?.tender.boq?.items, vendorRates, isSubmitted]);

    const handleSubmitTender = useCallback(async () => {
        if (!allRatesFilled || isSubmitted) {
            Notify.error("Please fill in all rate fields before submitting.")
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                notes: submitNotes,
                vendor_rates: vendorRates
            };

            await api.post(
                `/civil/vendor/tenders/${id}/submit/`,
                submitData
            );

            Notify.success("Tender submitted successfully!");

            setShowSubmitModal(false);
        } catch (error) {
            if (error.response && error.response.data.message) {
                Notify.error( error.response.data.message);
            } else {
                Notify.error('An error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [id, submitNotes, vendorRates, allRatesFilled, isSubmitted]);

    const getDaysRemaining = useCallback(() => {
        if (!boqData?.tender.ended_at) return null;
        const endDate = new Date(boqData.tender.ended_at);
        const now = new Date();
        const diffTime = endDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [boqData?.tender.ended_at]);

    const getStatusColor = useCallback((status) => {
        switch (status) {
            case "invited":
                return "bg-warning/10 text-warning border-warning";
            case "submitted":
                return "bg-primary/10 text-primary border-primary";
            case "rejected":
                return "bg-danger/10 text-danger border-danger";
            case "awarded":
                return "bg-success/10 text-success border-success";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    }, []);

    const daysRemaining = useMemo(() => getDaysRemaining(), [getDaysRemaining]);
    const isExpired = useMemo(() => daysRemaining !== null && daysRemaining < 0, [daysRemaining]);
    const canSubmit = useMemo(() =>
            boqData?.is_submit_able && !isExpired && (boqData?.status === "invited" || boqData?.status === "under_negotiation") && allRatesFilled && !isSubmitted,
        [boqData?.is_submit_able, boqData?.status, isExpired, allRatesFilled, isSubmitted]
    );

    const getVendorRateForItem = useCallback((itemId) => {
        const vendorRate = vendorRates.find(vr => vr.item === itemId);
        return {
            rate: vendorRate?.rate || "",
            amount: vendorRate?.amount || 0
        };
    }, [vendorRates]);

    const StatusBadge = React.memo(({ status }) => (
        <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                status
            )}`}
        >
            <div
                className={`w-2 h-2 rounded-full ${
                    status === "invited"
                        ? "bg-warning"
                        : status === "submitted"
                            ? "bg-primary"
                            : status === "rejected"
                                ? "bg-danger"
                                : "bg-success"
                }`}
            ></div>
            {toTitleCase(status)}
        </div>
    ));

    StatusBadge.displayName = 'StatusBadge';

    const tableRows = useMemo(() => {
        if (!boqData?.tender.boq?.items) return [];

        return boqData.tender.boq.items.map((item, index) => {
            const vendorRate = getVendorRateForItem(item.id);
            return (
                <ItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    vendorRate={vendorRate.rate}
                    vendorAmount={vendorRate.amount}
                    hasError={inputErrors[item.id]}
                    onRateChange={handleRateChange}
                    formatAmountWithCommas={formatAmountWithCommas}
                    currency={boqData.tender.boq?.currency}
                    isReadOnly={isSubmitted}
                />
            );
        });
    }, [boqData?.tender.boq?.items, getVendorRateForItem, inputErrors, handleRateChange, formatAmountWithCommas, isSubmitted]);

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

    const SubmissionDetails = React.memo(() => {
        if (!isSubmitted) return null;

        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                        <p className="text-gray-600">Your tender has been successfully submitted</p>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Clock size={20} className="text-gray-500" />
                            <div>
                                <div className="font-semibold text-gray-900">Submitted At</div>
                                <div className="text-sm text-gray-600">{boqData.submitted_at}</div>
                            </div>
                        </div>
                        {boqData.notes && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <MessageSquare size={20} className="text-gray-500 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-gray-900">Notes</div>
                                    <div className="text-sm text-gray-600">{boqData.notes}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    SubmissionDetails.displayName = 'SubmissionDetails';

    const SubmitModal = React.memo(() => {
        if (!showSubmitModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <Send size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Submit Tender</h3>
                        </div>
                        <p className="text-gray-600">Review your proposal before submission</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 border border-gray-400 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-2">Proposal Summary</h4>
                            <div className="text-sm text-primary">
                                <div className="flex justify-between mb-1">
                                    <span>Total Items:</span>
                                    <span className="font-semibold">{boqData?.tender.boq?.items?.length || 0}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Your Total Amount:</span>
                                    <span className="font-bold">
                                        {boqData?.tender.boq?.currency} {formatAmountWithCommas(calculateTotalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Original Amount:</span>
                                    <span>{boqData?.tender.boq?.currency} {formatAmountWithCommas(boqData?.tender.boq?.total_amount || 0)}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-700 mb-1 mt-6">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={submitNotes}
                                    onChange={(e) => setSubmitNotes(e.target.value)}
                                    placeholder="Add any additional comments or notes for your submission..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-amber-600 mt-0.5"/>
                                <div>
                                    <h4 className="font-medium text-amber-900">Important Notice</h4>
                                    <p className="text-sm text-amber-800 mt-1">
                                        Once submitted, you cannot modify your rates or proposal. Please review all
                                        details carefully.
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
                            className="flex-1 bg-primary/10 text-primary hover:text-white hover:bg-primary px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
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
                heading={<h1 className="text-3xl font-bold">{boqData.tender.title}</h1>}
                description={
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} />
                        <span className="text-gray-500">{boqData.tender.boq?.site?.name}</span>
                        <span>→</span>
                        <span className="text-gray-600">{boqData.tender.boq?.project?.name}</span>
                    </div>
                }
                icon={HardDrive}
                children={
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                                {formatDate(boqData.tender.started_at, "MMM dd, yyyy")} -{" "}
                                {formatDate(boqData.tender.ended_at, "MMM dd, yyyy")}
                            </span>
                        </div>
                        <StatusBadge status={boqData.status} />
                    </div>
                }
            />

            <div className="mx-auto pb-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <BoqStatCard
                        icon={<Package2 size={24}/>}
                        label="Total Items"
                        value={boqData.tender.boq?.items?.length || 0}
                        sublabel="Construction items"
                    />
                    <BoqStatCard
                        icon={<DollarSign size={24}/>}
                        label="Original Amount"
                        value={`${boqData.tender.boq?.currency} ${formatAmountWithCommas(boqData.tender.boq?.total_amount || 0)}`}
                        sublabel="Project cost"
                    />
                    <BoqStatCard
                        icon={<Target size={24}/>}
                        label="Your Amount"
                        value={`${boqData.tender.boq?.currency} ${formatAmountWithCommas(calculateTotalAmount)}`}
                        sublabel="Your proposal"
                    />
                    <BoqStatCard
                        icon={<Clock size={24}/>}
                        label="Days Remaining"
                        value={daysRemaining !== null ? (isExpired ? "Expired" : daysRemaining) : "N/A"}
                        sublabel="Until deadline"
                    />
                </div>
                {isSubmitted && <SubmissionDetails />}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FilesSection
                        title="Project Drawings"
                        fileIds={boqData.tender.boq.project_drawing_files || []}
                        icon={<Grid3X3 size={20}/>}
                        emptyMessage="No project drawings have been uploaded for this tender."
                        type="Drawing"
                    />

                    <FilesSection
                        title="Tender Attachments"
                        fileIds={boqData.tender.attachments || []}
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
                                    {canSubmit ? (
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            className="text-primary bg-primary/10 hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Send size={20}/>
                                            Submit Tender
                                        </button>
                                    ) : (
                                        <div
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg border">
                                            {isExpired ? <AlertTriangle size={18}/> :
                                                !allRatesFilled ? <AlertTriangle size={18}/> :
                                                    <CheckCircle size={18}/>}
                                            <span className="font-medium">
                                                {isExpired ? "Submission Closed" :
                                                    !allRatesFilled ? "Fill All Rates" :
                                                        boqData.status !== "invited" ? "Proposal Submitted" : "Not Submittable"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {boqData.tender.boq?.items?.length > 0 ? (
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
                                                        className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
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
                                                    {boqData.tender.boq?.currency} {formatAmountWithCommas(boqData.tender.boq?.total_amount || 0)}
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center gap-6 px-6 py-4 bg-white border-2 border-blue-300 rounded-xl shadow-lg">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                                        <Target size={20}/>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-blue-900">Your Total
                                                        </div>
                                                        <div className="text-sm text-blue-600">Your proposal</div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {boqData.tender.boq?.currency} {formatAmountWithCommas(calculateTotalAmount)}
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