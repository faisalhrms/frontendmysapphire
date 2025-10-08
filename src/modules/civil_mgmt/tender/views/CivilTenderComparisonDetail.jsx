import React, { useState, useMemo } from "react";
import {
    Award,
    Calendar,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Eye,
    Filter,
    Grid3X3,
    HardDrive,
    MapPin,
    MessageSquare,
    Search,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    CheckCircle,
    BarChart3,
    Download,
    Mail,
    Phone,
    Building, XCircle, Package2, RefreshCw,
} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import {useParams} from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import Notify from "@helpers/toastNotifications.js";
import {formatDate} from "@helpers/dateTime.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const CivilTenderComparisonDetail = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [sortBy, setSortBy] = useState("total_amount");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showAwardModal, setShowAwardModal] = useState(false);
    const [awardingVendor, setAwardingVendor] = useState(null);
    const [showNegotiationModal, setShowNegotiationModal] = useState(false);
    const [negotiationVendor, setNegotiationVendor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [isAwarding, setIsAwarding] = useState(false);
    const [submitNotes, setSubmitNotes] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "all",
        amountRange: "all",
        awardedTenders: "all"
    });
    const { id } = useParams();

    const { data: mockTenderData, isLoading, error, refetch } = useQuery({
        queryKey: ["civil-boq-tenders-comparison", id],
        queryFn: async () => {
            const { data } = await api.get(`/civil/boq-tenders/${id}/comparison/`);
            return data.data;
        },
        enabled: !!id,
        cacheTime: 0,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const stats = useMemo(() => {
        if (!mockTenderData?.vendor_submissions) {
            return {
                totalVendors: 0,
                submittedCount: 0,
                negotiationCount: 0,
                invitedCount: 0,
                lowestAmount: 0,
                highestAmount: 0,
                averageAmount: 0,
                savings: 0,
                hasSubmissions: false
            };
        }

        const submissions = mockTenderData.vendor_submissions;
        const validAmounts = submissions
            .filter(s => s.total_amount !== null && s.total_amount !== undefined)
            .map(s => s.total_amount);

        return {
            totalVendors: submissions.length,
            submittedCount: submissions.filter(s => s.status === "submitted" || s.status === "awarded").length,
            negotiationCount: submissions.filter(s => s.status === "under_negotiation").length,
            invitedCount: submissions.filter(s => s.status === "invited").length,
            lowestAmount: validAmounts.length > 0 ? Math.min(...validAmounts) : 0,
            highestAmount: validAmounts.length > 0 ? Math.max(...validAmounts) : 0,
            averageAmount: validAmounts.length > 0 ? validAmounts.reduce((a, b) => a + b, 0) / validAmounts.length : 0,
            savings: validAmounts.length > 0 && mockTenderData?.boq?.total_amount ?
                mockTenderData.boq.total_amount - Math.min(...validAmounts) : 0,
            hasSubmissions: validAmounts.length > 0
        };
    }, [mockTenderData]);

    const filteredVendors = useMemo(() => {
        if (!mockTenderData?.vendor_submissions) return [];

        let filtered = mockTenderData.vendor_submissions;

        if (searchTerm.trim()) {
            filtered = filtered.filter(submission =>
                submission.vendor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (submission.vendor.phone && submission.vendor.phone.includes(searchTerm))
            );
        }

        if (filters.status !== "all") {
            filtered = filtered.filter(submission => submission.status === filters.status);
        }

        if (filters.amountRange !== "all") {
            filtered = filtered.filter(submission => {
                const amount = submission.total_amount;
                if (amount === null || amount === undefined) return filters.amountRange === "no_submission";

                switch (filters.amountRange) {
                    case "under_2500000":
                        return amount < 2500000;
                    case "2500000_2800000":
                        return amount >= 2500000 && amount <= 2800000;
                    case "over_2800000":
                        return amount > 2800000;
                    case "no_submission":
                        return false;
                    default:
                        return true;
                }
            });
        }

        if (filters.awardedTenders !== "all") {
            filtered = filtered.filter(submission => {
                const awards = submission.awarded_tenders;
                switch (filters.awardedTenders) {
                    case "under_50":
                        return awards < 50;
                    case "50_100":
                        return awards >= 50 && awards <= 100;
                    case "over_100":
                        return awards > 100;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [mockTenderData, searchTerm, filters]);

    const sortedVendors = useMemo(() => {
        const vendors = [...filteredVendors];

        vendors.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case "total_amount":
                    valueA = a.total_amount || 0;
                    valueB = b.total_amount || 0;
                    break;
                case "vendor_name":
                    valueA = a.vendor.full_name;
                    valueB = b.vendor.full_name;
                    break;
                case "awarded_tenders":
                    valueA = a.awarded_tenders;
                    valueB = b.awarded_tenders;
                    break;
                case "submitted_at":
                    valueA = a.submitted_at ? new Date(a.submitted_at) : new Date(0);
                    valueB = b.submitted_at ? new Date(b.submitted_at) : new Date(0);
                    break;
                default:
                    return 0;
            }

            if (typeof valueA === "string") {
                return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        });

        return vendors;
    }, [filteredVendors, sortBy, sortOrder]);

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return <EmptyState icon={XCircle} heading="Unable to Load Tender" description={error?.message} />;
    if (!mockTenderData)
        return <EmptyState icon={Package2} heading="Tender Not Found" description="The requested Tender could not be located in our system" />;

    const formatAmount = (amount, currency = mockTenderData.boq.currency) => {
        return currency + ' ' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "submitted":
                return "bg-info/10 text-info border-info";
            case "under_negotiation":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "awarded":
                return "bg-success/10 text-success border-success";
            case "rejected":
                return "bg-danger/10 text-danger border-danger";
            case "invited":
                return "bg-gray-50 text-gray-700 border-gray-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const handleAwardVendor = (vendor) => {
        setAwardingVendor(vendor);
        setShowAwardModal(true);
    };

    const handleNegotiation = (vendor) => {
        setNegotiationVendor(vendor);
        setShowNegotiationModal(true);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            status: "all",
            amountRange: "all",
            awardedTenders: "all"
        });
        setSearchTerm("");
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.status !== "all") count++;
        if (filters.amountRange !== "all") count++;
        if (filters.awardedTenders !== "all") count++;
        if (searchTerm.trim()) count++;
        return count;
    };

    const handleConfirmAward = async () => {
        setIsAwarding(true);
        try {
            const submitData = {
                notes: submitNotes,
                vendor_id: awardingVendor.vendor.id
            };

            await api.post(
                `/civil/boq-tenders/${id}/award/`,
                submitData
            );
            await refetch();
            Notify.success(`Contract awarded to ${awardingVendor.vendor.full_name}`);
            setShowAwardModal(false);
            setAwardingVendor(null);
            setSubmitNotes("");
        } catch (error) {
            if (error.response && error.response.data.message) {
                Notify.error( error.response.data.message);
            } else {
                Notify.error('An error occurred.');
            }
        } finally {
            setIsAwarding(false);
        }
    };

    const handleStartNegotiation = async () => {
        setIsNegotiating(true);
        try {
            const submitData = {
                notes: submitNotes,
                vendor_id: negotiationVendor.vendor.id
            };

            await api.post(
                `/civil/boq-tenders/${id}/negotiate/`,
                submitData
            );

            await refetch();
            Notify.success(` Negotiation initiated with ${negotiationVendor.vendor.full_name}. They can now resubmit their tender.`);
            setShowNegotiationModal(false);
            setNegotiationVendor(null);
            setSubmitNotes("");
        } catch (error) {
            if (error.response && error.response.data.message) {
                Notify.error( error.response.data.message);
            } else {
                Notify.error('An error occurred.');
            }
        } finally {
            setIsNegotiating(false);
        }
    };

    const getVariancePercentage = (vendorAmount, originalAmount) => {
        return ((vendorAmount - originalAmount) / originalAmount * 100).toFixed(1);
    };

    const StatCard = ({ icon, label, value, sublabel, trend }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:text-gray-200 dark:bg-bodybg">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center ">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        trend > 0 ? 'text-danger' : 'text-success'
                    }`}>
                        {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{label}</div>
                {sublabel && <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{sublabel}</div>}
            </div>
        </div>
    );

    const VendorCard = ({ submission, index }) => {
        const hasSubmission = submission.total_amount !== null && submission.total_amount !== undefined;
        const variance = hasSubmission ? getVariancePercentage(submission.total_amount, mockTenderData.boq.total_amount) : null;
        const isLowest = hasSubmission && stats.hasSubmissions && submission.total_amount === stats.lowestAmount;

        return (
            <div className={`border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md dark:text-gray-200 dark:bg-bodybg ${
                isLowest ? 'border-success bg-success/10' : 'border-gray-200 bg-white'
            }`}>
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 dark:text-gray-200 dark:bg-bodybg">
                            <div className="relative">
                                {submission.vendor.avatar?.small_url ? (
                                    <img
                                        src={submission.vendor.avatar.small_url}
                                        alt={submission.vendor.full_name}
                                        className="w-12 h-12 rounded-xl object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg ${submission.vendor.avatar?.small_url ? 'hidden' : 'flex'}`}>
                                    {submission.vendor.full_name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{submission.vendor.full_name}</h3>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Award size={14} className="text-primary dark:text-gray-200 dark:bg-bodybg" />
                                        <span>{submission.awarded_tenders} awarded</span>
                                    </div>
                                    {submission.vendor.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone size={14} />
                                            <span>{submission.vendor.phone}</span>
                                        </div>
                                    )}
                                    {isLowest && (
                                        <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full font-medium">
                                        Lowest Bid
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border  border-gray-200 dark:text-gray-200 dark:bg-bodybg ${getStatusColor(submission.status)}`}>
                            {submission.status.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1">
                            <div className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">Bid Amount</div>
                            {hasSubmission ? (
                                <>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">
                                        {formatAmount(submission.total_amount)}
                                    </div>
                                    <div className={`text-sm font-medium ${
                                        parseFloat(variance) < 0 ? 'text-success' : 'text-danger'
                                    }`}>
                                        {variance > 0 ? '+' : ''}{variance}% from original
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                    Not submitted yet
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">Submitted</div>
                            {submission.submitted_at ? (
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                    {formatDate(submission.submitted_at, "dd, MMM yyyy - HH:mm")}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                    Pending submission
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                <Mail size={12} />
                                <span>{submission.vendor.email}</span>
                            </div>
                        </div>
                    </div>

                    {submission.notes && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1 dark:text-gray-200 dark:bg-bodybg">Vendor Notes</div>
                            <div className="text-sm text-gray-800 dark:text-gray-200 dark:bg-bodybg">{submission.notes}</div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {hasSubmission && (
                            <button
                                onClick={() => setActiveTab("comparison")}
                                className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors text-sm ${isLowest ? 'bg-white hover:bg-gray-400' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Eye size={16} className="inline mr-2" />
                                View Details
                            </button>
                        )}

                        {(submission.status === "submitted" && mockTenderData.status === 'open') && (
                            <>
                                <button
                                    onClick={() => handleNegotiation(submission)}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm"
                                >
                                    <MessageSquare size={16} className="inline mr-2" />
                                    Negotiate
                                </button>
                                <button
                                    onClick={() => handleAwardVendor(submission)}
                                    className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:text-opacity-80 transition-colors text-sm"
                                >
                                    <Award size={16} className="inline mr-2" />
                                    Award
                                </button>
                            </>
                        )}

                        {(submission.status === "under_negotiation" && mockTenderData.status === 'open') &&  (
                            <button
                                onClick={() => handleAwardVendor(submission)}
                                className="px-4 py-2 bg-success/10 hover:text-white rounded-lg font-medium hover:bg-success transition-colors text-sm"
                            >
                                <Award size={16} className="inline mr-2" />
                                Award Contract
                            </button>
                        )}

                        {submission.status === "invited" && (
                            <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm text-center  border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                Awaiting vendor response
                            </div>
                        )}

                        {submission.status === "awarded" && (
                            <div className="flex-1 px-4 py-2 bg-success-gradient rounded-lg text-sm text-center font-medium border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                <Award size={16} className="inline mr-2" />
                                Contract Awarded
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const FilterPanel = () => (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Filters</h3>
                <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                        </span>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary hover:text-primaryrgb font-medium"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200 dark:bg-bodybg">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg"
                    >
                        <option value="all">All Statuses</option>
                        <option value="invited">Invited</option>
                        <option value="submitted">Submitted</option>
                        <option value="under_negotiation">Under Negotiation</option>
                        <option value="awarded">Awarded</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200 dark:bg-bodybg">Bid Amount Range</label>
                    <select
                        value={filters.amountRange}
                        onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg"
                    >
                        <option value="all">All Amounts</option>
                        <option value="under_2500000">Under Rs. 2,500,000</option>
                        <option value="2500000_2800000">Rs. 2,500,000 - 2,800,000</option>
                        <option value="over_2800000">Over Rs. 2,800,000</option>
                        <option value="no_submission">No Submission</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200 dark:bg-bodybg">Experience Level</label>
                    <select
                        value={filters.awardedTenders}
                        onChange={(e) => handleFilterChange('awardedTenders', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-gray-200 dark:bg-bodybg"
                    >
                        <option value="all">All Experience Levels</option>
                        <option value="under_50">New Contractors (&lt; 50 tenders)</option>
                        <option value="50_100">Experienced (50-100 tenders)</option>
                        <option value="over_100">Highly Experienced (&gt; 100 tenders)</option>
                    </select>
                </div>
            </div>

            {getActiveFiltersCount() > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Showing {filteredVendors.length} of {mockTenderData.vendor_submissions.length} vendors</span>
                    </div>
                </div>
            )}
        </div>
    );

    const ComparisonTable = () => (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Vendor Comparison</h3>
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary min-w-40 dark:text-gray-200 dark:bg-bodybg"
                        >
                            <option value="total_amount">Sort by Amount</option>
                            <option value="vendor_name">Sort by Name</option>
                            <option value="awarded_tenders">Sort by Awards</option>
                            <option value="submitted_at">Sort by Date</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Vendor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Bid Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Variance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Awards
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200  border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                    {sortedVendors.map((submission, index) => {
                        const hasSubmission = submission.total_amount !== null && submission.total_amount !== undefined;
                        const variance = hasSubmission ? getVariancePercentage(submission.total_amount, mockTenderData.boq.total_amount) : null;
                        const isLowest = hasSubmission && stats.hasSubmissions && submission.total_amount === stats.lowestAmount;

                        return (
                            <tr key={submission.id} className={` ${isLowest ? 'bg-success/10' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="relative mr-4">
                                            {submission.vendor.avatar?.small_url ? (
                                                <img
                                                    src={submission.vendor.avatar.small_url}
                                                    alt={submission.vendor.full_name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-medium ${submission.vendor.avatar?.small_url ? 'hidden' : 'flex'}`}>
                                                {submission.vendor.full_name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                                    {submission.vendor.full_name}
                                                </div>
                                                {isLowest && (
                                                    <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
                                                            Lowest
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2 dark:text-gray-200 dark:bg-bodybg">
                                                <Award size={12} className="text-primary" />
                                                {submission.awarded_tenders} tenders awarded
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                        {hasSubmission ? formatAmount(submission.total_amount) :
                                            <span className="text-gray-500 italic dark:text-gray-200 dark:bg-bodybg">Not submitted</span>
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {hasSubmission ? (
                                        <div className={`text-sm font-medium ${
                                            parseFloat(variance) < 0 ? 'text-success' : 'text-danger'
                                        }`}>
                                            {variance > 0 ? '+' : ''}{variance}%
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 italic dark:text-gray-200 dark:bg-bodybg">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        <Award size={14} className="text-primary" />
                                        <span className="text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{submission.awarded_tenders}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border border-gray-200 dark:text-gray-200 dark:bg-bodybg ${getStatusColor(submission.status)}`}>
                                        {submission.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {(submission.status === "submitted" && mockTenderData.status === 'open') && (
                                        <>
                                            <button
                                                onClick={() => handleNegotiation(submission)}
                                                className="text-amber-600 hover:underline"
                                            >
                                                Negotiate
                                            </button>
                                            <button
                                                onClick={() => handleAwardVendor(submission)}
                                                className="text-success hover:underline"
                                            >
                                                Award
                                            </button>
                                        </>
                                    )}
                                    {(submission.status === "under_negotiation" && mockTenderData.status === 'open') && (
                                        <button
                                            onClick={() => handleAwardVendor(submission)}
                                            className="text-success hover:underline"
                                        >
                                            Award Contract
                                        </button>
                                    )}
                                    {submission.status === "invited" && (
                                        <span className="text-gray-500 italic dark:text-gray-200 dark:bg-bodybg">Pending</span>
                                    )}
                                    {submission.status === "awarded" && (
                                        <span className="text-success font-medium dark:text-gray-200 dark:bg-bodybg">Awarded</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <div className="mx-auto py-8">
                    <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <HardDrive size={32}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-3xl font-bold text-gray-900">{mockTenderData.title}</h3>
                                    <span className="bg-info/10 text-info px-3 py-1 rounded-full text-sm font-medium">
                                            {mockTenderData.status.toUpperCase()}
                                        </span>
                                </div>
                                <div className="flex items-center gap-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16}/>
                                        <span>{mockTenderData.site.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building size={16}/>
                                        <span>{mockTenderData.project.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16}/>
                                        <span>{formatDate(mockTenderData.started_at)} - {formatDate(mockTenderData.ended_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex space-x-8">
                        {[
                            {id: "overview", label: "Overview", icon: BarChart3},
                            {id: "vendors", label: "Vendor Proposals", icon: Users},
                            {id: "comparison", label: "Detailed Comparison", icon: Grid3X3},
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <tab.icon size={16}/>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-8 ">
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dark:text-gray-200 dark:bg-bodybg">
                            <StatCard
                                icon={<Users size={24}/>}
                                label="Total Vendors"
                                value={stats.totalVendors}
                                sublabel={`${stats.submittedCount} submitted, ${stats.invitedCount} pending`}
                            />
                            <StatCard
                                icon={<DollarSign size={24}/>}
                                label="Original Budget"
                                value={formatAmount(mockTenderData.boq.total_amount)}
                                sublabel="Project estimate"
                            />
                            <StatCard
                                icon={<Target size={24}/>}
                                label="Lowest Bid"
                                value={stats.hasSubmissions ? formatAmount(stats.lowestAmount) : "No submissions"}
                                sublabel={stats.hasSubmissions ? "Best offer received" : "Awaiting proposals"}
                                trend={-((mockTenderData.boq.total_amount - stats.lowestAmount) / mockTenderData.boq.total_amount * 100).toFixed(1)}
                            />
                            <StatCard
                                icon={<TrendingDown size={24}/>}
                                label="Potential Savings"
                                value={stats.hasSubmissions ? formatAmount(stats.savings) : "TBD"}
                                sublabel={stats.hasSubmissions ? "Cost reduction" : "To be determined"}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:text-gray-200 dark:bg-bodybg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-gray-200 dark:text-gray-200 dark:bg-bodybg ">
                                        <BarChart3 size={20}/>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Bid Analysis</h3>
                                </div>

                                <div className="space-y-4">
                                    {stats.hasSubmissions ? (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Average Bid:</span>
                                                <span
                                                    className="font-semibold">{formatAmount(stats.averageAmount)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Bid Range:</span>
                                                <span className="font-semibold">
                                                    {formatAmount(stats.lowestAmount)} - {formatAmount(stats.highestAmount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Variance:</span>
                                                <span className="font-semibold">
                                                    {formatAmount(stats.highestAmount - stats.lowestAmount)}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className="text-gray-500">No submissions received yet</div>
                                            <div className="text-sm text-gray-400 mt-1">Analysis will be available once
                                                vendors submit their bids
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:text-gray-200 dark:bg-bodybg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
                                        <CheckCircle size={20}/>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Status Summary</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">Invited:</span>
                                        <span className="font-semibold text-gray-600 ">{stats.invitedCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">Submitted:</span>
                                        <span className="font-semibold text-info">{stats.submittedCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">Under Negotiation:</span>
                                        <span className="font-semibold text-amber-600">{stats.negotiationCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">Response Rate:</span>
                                        <span className="font-semibold text-success">
                                                {stats.totalVendors > 0 ? Math.round((stats.submittedCount / stats.totalVendors) * 100) : 0}%
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:text-gray-200 dark:bg-bodybg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                        {stats.hasSubmissions ? "Top 3 Proposals" : "Invited Vendors"}
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab("vendors")}
                                        className="text-primary hover:underline font-medium "
                                    >
                                        View All {stats.hasSubmissions ? "Proposals" : "Vendors"} →
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 ">
                                {sortedVendors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {sortedVendors.slice(0, 3).map((submission, index) => (
                                            <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
                                                        {submission.vendor.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{submission.vendor.full_name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Award size={10} className="text-primary"/>
                                                            {submission.awarded_tenders} tenders
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">Status:</span>
                                                        <span className={`font-semibold ${
                                                            submission.status === 'awarded' ? 'text-success' :
                                                                submission.status === 'submitted' ? 'text-primary' :
                                                                    'text-gray-500'
                                                        }`}>
                                                            {submission.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {submission.total_amount && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Bid:</span>
                                                            <span
                                                                className="font-bold">{formatAmount(submission.total_amount)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500">No vendors invited yet</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "vendors" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold dark:text-gray-200 dark:bg-bodybg">Vendor Proposals</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search size={16}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="text"
                                        placeholder="Search vendors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-gray-200 dark:bg-bodybg"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                                        showFilters || getActiveFiltersCount() > 0
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Filter size={16}/>
                                    Filters
                                    {getActiveFiltersCount() > 0 && (
                                        <span
                                            className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {showFilters && <FilterPanel/>}

                        {filteredVendors.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                                <div
                                    className="w-16 h-16 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Users size={32}/>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || getActiveFiltersCount() > 0
                                        ? "No vendors match your current search and filter criteria."
                                        : "No vendors have been invited to this tender yet."
                                    }
                                </p>
                                {(searchTerm || getActiveFiltersCount() > 0) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="px-4 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger hover:text-white font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {sortedVendors.map((submission, index) => (
                                    <VendorCard key={submission.id} submission={submission} index={index}/>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "comparison" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold dark:text-gray-200 dark:bg-bodybg">Detailed Comparison</h2>
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-info/10 text-info hover:text-white rounded-lg hover:bg-info">
                                <Download size={16}/>
                                Export Comparison
                            </button>
                        </div>

                        <ComparisonTable/>

                        {stats.hasSubmissions && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900">Item-wise Rate Comparison</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Original
                                                Rate
                                            </th>
                                            {sortedVendors.filter(v => v.total_amount !== null).map((vendor) => (
                                                <th key={vendor.id}
                                                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    {vendor.vendor.full_name}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-20 dark:text-gray-200 dark:bg-bodybg0">
                                        {mockTenderData.boq.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.name}</div>
                                                        <div
                                                            className="text-sm text-gray-500">{item.item_no} | {item.quantity} {item.unit}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div
                                                        className="font-semibold text-gray-900">{formatAmount(item.rate, mockTenderData.boq.currency)}</div>
                                                </td>
                                                {sortedVendors.filter(v => v.total_amount !== null).map((vendor) => {
                                                    const vendorItem = vendor.items.find(vi => vi.item_id === item.id);
                                                    const submittedVendors = sortedVendors.filter(v => v.total_amount !== null);
                                                    const isLowest = vendorItem && submittedVendors.every(v => {
                                                        const otherItem = v.items.find(vi => vi.item_id === item.id);
                                                        return !otherItem || vendorItem.rate <= otherItem.rate;
                                                    });

                                                    return (
                                                        <td key={vendor.id} className="px-4 py-4 text-center">
                                                            <div
                                                                className={`font-semibold ${isLowest ? 'text-success bg-success/10 px-2 py-1 rounded-full' : 'text-gray-900'}`}>
                                                                {vendorItem ? formatAmount(vendorItem.rate, mockTenderData.boq.currency) : 'N/A'}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showAwardModal && awardingVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                                    <Award size={24}/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Award Contract</h3>
                                    <p className="text-gray-600">Confirm contract award
                                        to {awardingVendor.vendor.full_name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-success/10 border border-success rounded-lg p-4">
                                <h4 className="font-semibold text-success mb-2">Award Summary</h4>
                                <div className="space-y-2 text-sm text-green-700">
                                    <div className="flex justify-between">
                                        <span>Vendor:</span>
                                        <span className="font-semibold">{awardingVendor.vendor.full_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bid Amount:</span>
                                        <span className="font-bold">{formatAmount(awardingVendor.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Savings:</span>
                                        <span className="font-bold">
                                            {formatAmount(mockTenderData.boq.total_amount - awardingVendor.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Award Notes (Optional)
                                </label>
                                <textarea
                                    value={submitNotes}
                                    onChange={(e) => setSubmitNotes(e.target.value)}
                                    placeholder="Add any notes regarding this award..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success focus:border-transparent resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                            <button
                                onClick={() => setShowAwardModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
                                disabled={isAwarding}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAward}
                                disabled={isAwarding}
                                className="flex-1 bg-success-gradient text-white px-4 py-3 rounded-lg font-medium hover:bg-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isAwarding ? (
                                    <>
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Awarding...
                                    </>
                                ) : (
                                    <>
                                        <Award size={16}/>
                                        Confirm Award
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNegotiationModal && negotiationVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                <MessageSquare size={24}/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Start Negotiation</h3>
                                <p className="text-gray-600">Initiate negotiation
                                    with {negotiationVendor.vendor.full_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 mb-2">Negotiation Details</h4>
                            <div className="space-y-2 text-sm text-amber-700">
                                <div className="flex justify-between">
                                    <span>Vendor:</span>
                                    <span className="font-semibold">{negotiationVendor.vendor.full_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Current Bid:</span>
                                    <span className="font-bold">{formatAmount(negotiationVendor.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-medium">Will allow resubmission</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Negotiation Notes (Optional)
                            </label>
                            <textarea
                                value={submitNotes}
                                onChange={(e) => setSubmitNotes(e.target.value)}
                                placeholder="Add any specific requirements or notes for the negotiation..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                        <button
                            onClick={() => setShowNegotiationModal(false)}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
                            disabled={isNegotiating}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartNegotiation}
                            disabled={isNegotiating}
                            className="flex-1 bg-amber-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isNegotiating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <MessageSquare size={16}/>
                                    Start Negotiation
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

export default React.memo(CivilTenderComparisonDetail);