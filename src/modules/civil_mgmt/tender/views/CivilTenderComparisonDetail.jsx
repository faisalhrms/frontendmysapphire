import React, { useState, useMemo, useCallback } from "react";
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
    Send,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    CheckCircle,
    BarChart3,
    Download,
    Mail,
    Phone,
    Building,
} from "lucide-react";

const mockTenderData = {
    id: "T-2024-001",
    title: "Construction of Modern Office Complex - Phase 1",
    description: "Complete construction of a 5-story modern office complex with underground parking, meeting rooms, and recreational facilities.",
    status: "open",
    created_at: "2024-01-15T08:00:00Z",
    started_at: "2024-01-20T08:00:00Z",
    ended_at: "2024-02-20T23:59:59Z",
    project: {
        name: "Downtown Business District",
        code: "DBD-2024"
    },
    site: {
        name: "Block A, Commercial Zone",
        location: "Downtown, Main City"
    },
    boq: {
        currency: "PKR",
        total_amount: 2850000,
        items_count: 45,
        items: [
            {
                id: 1,
                item_no: "ITM-001",
                name: "Excavation and Site Preparation",
                unit: "m³",
                quantity: 500,
                rate: 25.50,
                amount: 12750
            },
            {
                id: 2,
                item_no: "ITM-002",
                name: "Concrete Foundation (Grade 30)",
                unit: "m³",
                quantity: 200,
                rate: 120.00,
                amount: 24000
            },
            {
                id: 3,
                item_no: "ITM-003",
                name: "Steel Reinforcement Bars",
                unit: "kg",
                quantity: 15000,
                rate: 0.85,
                amount: 12750
            }
        ]
    },
    vendor_submissions: [
        {
            id: 1,
            vendor: {
                id: 1,
                full_name: "Elite Construction Ltd",
                email: "contact@eliteconstruction.com",
                phone: "+92-300-1234567",
                awarded_tenders: 127,
                avatar: {
                    id: 1,
                    file_name: "elite-construction",
                    file_extension: "jpg",
                    file_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                    small_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                }
            },
            status: "submitted",
            submitted_at: "2024-02-01T14:30:00Z",
            total_amount: 2750000,
            notes: "We propose using advanced materials and modern techniques to ensure quality and timely delivery.",
            items: [
                { item_id: 1, rate: 24.00, amount: 12000 },
                { item_id: 2, rate: 115.00, amount: 23000 },
                { item_id: 3, rate: 0.82, amount: 12300 }
            ]
        },
        {
            id: 2,
            vendor: {
                id: 2,
                full_name: "BuildMaster Corp",
                email: "info@buildmaster.com",
                phone: "+92-321-9876543",
                awarded_tenders: 89,
                avatar: {
                    id: 2,
                    file_name: "buildmaster-corp",
                    file_extension: "jpg",
                    file_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    small_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
            },
            status: "submitted",
            submitted_at: "2024-02-02T09:15:00Z",
            total_amount: 2680000,
            notes: "Cost-effective solution with proven track record in similar projects.",
            items: [
                { item_id: 1, rate: 23.50, amount: 11750 },
                { item_id: 2, rate: 110.00, amount: 22000 },
                { item_id: 3, rate: 0.80, amount: 12000 }
            ]
        },
        {
            id: 3,
            vendor: {
                id: 3,
                full_name: "Rehab Zafar",
                email: "rehab.zafar@srl.com.pk",
                phone: "+923368697029",
                awarded_tenders: 156,
                avatar: {
                    id: 41,
                    file_name: "rehab-1_imresizer",
                    file_extension: "jpg",
                    file_url: "http://127.0.0.1:8000/media/uploads/2025/03/05/rehab-1_imresizer.jpg",
                    small_url: "http://127.0.0.1:8000/media/uploads/2025/03/05/rehab-1_imresizer-sm.jpg"
                }
            },
            status: "submitted",
            submitted_at: "2024-02-03T16:45:00Z",
            total_amount: 2820000,
            notes: "Premium quality materials and experienced workforce for exceptional results.",
            items: [
                { item_id: 1, rate: 26.00, amount: 13000 },
                { item_id: 2, rate: 125.00, amount: 25000 },
                { item_id: 3, rate: 0.88, amount: 13200 }
            ]
        },
        {
            id: 4,
            vendor: {
                id: 4,
                full_name: "Swift Construction Co",
                email: "contact@swiftconstruction.com",
                phone: "+92-333-4567890",
                awarded_tenders: 45,
                avatar: {
                    id: 4,
                    file_name: "swift-construction",
                    file_extension: "jpg",
                    file_url: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
                    small_url: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
                }
            },
            status: "under_negotiation",
            submitted_at: "2024-01-30T11:20:00Z",
            total_amount: 2950000,
            notes: "Detailed proposal with focus on sustainability and green building practices.",
            items: [
                { item_id: 1, rate: 27.50, amount: 13750 },
                { item_id: 2, rate: 130.00, amount: 26000 },
                { item_id: 3, rate: 0.90, amount: 13500 }
            ]
        }
    ]
};

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
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "all",
        amountRange: "all",
        awardedTenders: "all"
    });

    const stats = useMemo(() => {
        const submissions = mockTenderData.vendor_submissions;
        const amounts = submissions.map(s => s.total_amount);

        return {
            totalVendors: submissions.length,
            submittedCount: submissions.filter(s => s.status === "submitted").length,
            negotiationCount: submissions.filter(s => s.status === "under_negotiation").length,
            lowestAmount: Math.min(...amounts),
            highestAmount: Math.max(...amounts),
            averageAmount: amounts.reduce((a, b) => a + b, 0) / amounts.length,
            savings: mockTenderData.boq.total_amount - Math.min(...amounts)
        };
    }, []);

    // Filter vendors based on search term and filters
    const filteredVendors = useMemo(() => {
        let filtered = mockTenderData.vendor_submissions;

        // Apply search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(submission =>
                submission.vendor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.vendor.phone.includes(searchTerm)
            );
        }

        // Apply status filter
        if (filters.status !== "all") {
            filtered = filtered.filter(submission => submission.status === filters.status);
        }

        // Apply amount range filter
        if (filters.amountRange !== "all") {
            filtered = filtered.filter(submission => {
                const amount = submission.total_amount;
                switch (filters.amountRange) {
                    case "under_2500000":
                        return amount < 2500000;
                    case "2500000_2800000":
                        return amount >= 2500000 && amount <= 2800000;
                    case "over_2800000":
                        return amount > 2800000;
                    default:
                        return true;
                }
            });
        }

        // Apply awarded tenders filter
        if (filters.awardedTenders !== "all") {
            filtered = filtered.filter(submission => {
                const awards = submission.vendor.awarded_tenders;
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
    }, [searchTerm, filters]);

    // Sort vendors
    const sortedVendors = useMemo(() => {
        const vendors = [...filteredVendors];

        vendors.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case "total_amount":
                    valueA = a.total_amount;
                    valueB = b.total_amount;
                    break;
                case "vendor_name":
                    valueA = a.vendor.full_name;
                    valueB = b.vendor.full_name;
                    break;
                case "awarded_tenders":
                    valueA = a.vendor.awarded_tenders;
                    valueB = b.vendor.awarded_tenders;
                    break;
                case "submitted_at":
                    valueA = new Date(a.submitted_at);
                    valueB = new Date(b.submitted_at);
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

    const formatAmount = (amount, currency = mockTenderData.boq.currency) => {
        const currencySymbol = currency === 'PKR' ? 'Rs.' : currency === 'USD' ? '$' : currency;
        return currencySymbol + ' ' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "submitted":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "under_negotiation":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "awarded":
                return "bg-green-50 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would make the actual API call to award the contract
            // await api.awardContract(awardingVendor.id, awardNotes);

            console.log(`Contract awarded to ${awardingVendor.vendor.full_name}`);
            setShowAwardModal(false);
            setAwardingVendor(null);

            // Show success message (you can add a toast notification here)
            alert(`Contract successfully awarded to ${awardingVendor.vendor.full_name}`);
        } catch (error) {
            console.error('Error awarding contract:', error);
            alert('Failed to award contract. Please try again.');
        } finally {
            setIsAwarding(false);
        }
    };

const handleStartNegotiation = async () => {
    setIsNegotiating(true);
    try {
        // Simulate API call to start negotiation
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Here you would make the actual API call to initiate negotiation
        // await api.startNegotiation(negotiationVendor.id, negotiationNotes);

        console.log(`Negotiation started with ${negotiationVendor.vendor.full_name}`);
        setShowNegotiationModal(false);
        setNegotiationVendor(null);

        // Show success message
        alert(`Negotiation initiated with ${negotiationVendor.vendor.full_name}. They can now resubmit their tender.`);
    } catch (error) {
        console.error('Error starting negotiation:', error);
        alert('Failed to start negotiation. Please try again.');
    } finally {
        setIsNegotiating(false);
    }
};

const getVariancePercentage = (vendorAmount, originalAmount) => {
    return ((vendorAmount - originalAmount) / originalAmount * 100).toFixed(1);
};

const StatCard = ({ icon, label, value, sublabel, trend }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                    trend > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                    {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
            {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
        </div>
    </div>
);

const VendorCard = ({ submission, index }) => {
    const variance = getVariancePercentage(submission.total_amount, mockTenderData.boq.total_amount);
    const isLowest = submission.total_amount === stats.lowestAmount;

    return (
        <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
            isLowest ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
        }`}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
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
                            <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg ${submission.vendor.avatar?.small_url ? 'hidden' : 'flex'}`}>
                                {submission.vendor.full_name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{submission.vendor.full_name}</h3>
                                {isLowest && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                            Lowest Bid
                                        </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Award size={14} className="text-blue-500" />
                                    <span>{submission.vendor.awarded_tenders} awarded</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone size={14} />
                                    <span>{submission.vendor.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                        {submission.status.replace('_', ' ').toUpperCase()}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-600">Bid Amount</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatAmount(submission.total_amount)}
                        </div>
                        <div className={`text-sm font-medium ${
                            parseFloat(variance) < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {variance > 0 ? '+' : ''}{variance}% from original
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm text-gray-600">Submitted</div>
                        <div className="text-sm font-medium text-gray-900">
                            {formatDate(submission.submitted_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail size={12} />
                            <span>{submission.vendor.email}</span>
                        </div>
                    </div>
                </div>

                {submission.notes && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Vendor Notes</div>
                        <div className="text-sm text-gray-800">{submission.notes}</div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab("comparison")}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Eye size={16} className="inline mr-2" />
                        View Details
                    </button>

                    {submission.status === "submitted" && (
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
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                            >
                                <Award size={16} className="inline mr-2" />
                                Award
                            </button>
                        </>
                    )}

                    {submission.status === "under_negotiation" && (
                        <button
                            onClick={() => handleAwardVendor(submission)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                        >
                            <Award size={16} className="inline mr-2" />
                            Award Contract
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterPanel = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                    </span>
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Clear All
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_negotiation">Under Negotiation</option>
                    <option value="awarded">Awarded</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Amount Range Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bid Amount Range</label>
                <select
                    value={filters.amountRange}
                    onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Amounts</option>
                    <option value="under_2500000">Under Rs. 2,500,000</option>
                    <option value="2500000_2800000">Rs. 2,500,000 - 2,800,000</option>
                    <option value="over_2800000">Over Rs. 2,800,000</option>
                </select>
            </div>

            {/* Awarded Tenders Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                    value={filters.awardedTenders}
                    onChange={(e) => handleFilterChange('awardedTenders', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Experience Levels</option>
                    <option value="under_50">New Contractors (&lt; 50 tenders)</option>
                    <option value="50_100">Experienced (50-100 tenders)</option>
                    <option value="over_100">Highly Experienced (&gt; 100 tenders)</option>
                </select>
            </div>
        </div>

        {/* Filter Summary */}
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Vendor Comparison</h3>
                <div className="flex items-center gap-3">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bid Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Awards
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sortedVendors.map((submission, index) => {
                    const variance = getVariancePercentage(submission.total_amount, mockTenderData.boq.total_amount);
                    const isLowest = submission.total_amount === stats.lowestAmount;

                    return (
                        <tr key={submission.id} className={`hover:bg-gray-50 ${isLowest ? 'bg-green-50/50' : ''}`}>
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
                                        <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-medium ${submission.vendor.avatar?.small_url ? 'hidden' : 'flex'}`}>
                                            {submission.vendor.full_name.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {submission.vendor.full_name}
                                            </div>
                                            {isLowest && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                        Lowest
                                                    </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <Award size={12} className="text-blue-500" />
                                            {submission.vendor.awarded_tenders} tenders awarded
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">
                                    {formatAmount(submission.total_amount)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${
                                    parseFloat(variance) < 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {variance > 0 ? '+' : ''}{variance}%
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <Award size={14} className="text-blue-500" />
                                    <span className="text-sm text-gray-900">{submission.vendor.awarded_tenders}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                                            {submission.status.replace('_', ' ').toUpperCase()}
                                        </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {submission.status === "submitted" && (
                                    <>
                                        <button
                                            onClick={() => handleNegotiation(submission)}
                                            className="text-amber-600 hover:text-amber-900"
                                        >
                                            Negotiate
                                        </button>
                                        <button
                                            onClick={() => handleAwardVendor(submission)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Award
                                        </button>
                                    </>
                                )}
                                {submission.status === "under_negotiation" && (
                                    <button
                                        onClick={() => handleAwardVendor(submission)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Award Contract
                                    </button>
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

const AwardModal = () => {
    if (!showAwardModal || !awardingVendor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <Award size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Award Contract</h3>
                            <p className="text-gray-600">Confirm contract award to {awardingVendor.vendor.full_name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Award Summary</h4>
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
                            placeholder="Add any notes regarding this award..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAwarding ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Awarding...
                            </>
                        ) : (
                            <>
                                <Award size={16} />
                                Confirm Award
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const NegotiationModal = () => {
    if (!showNegotiationModal || !negotiationVendor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Start Negotiation</h3>
                            <p className="text-gray-600">Initiate negotiation with {negotiationVendor.vendor.full_name}</p>
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
                                <MessageSquare size={16} />
                                Start Negotiation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center">
                            <HardDrive size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{mockTenderData.title}</h1>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {mockTenderData.status.toUpperCase()}
                                    </span>
                            </div>
                            <div className="flex items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>{mockTenderData.site.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building size={16} />
                                    <span>{mockTenderData.project.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{formatDate(mockTenderData.started_at)} - {formatDate(mockTenderData.ended_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <Download size={16} />
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Send size={16} />
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex space-x-8">
                    {[
                        { id: "overview", label: "Overview", icon: BarChart3 },
                        { id: "vendors", label: "Vendor Proposals", icon: Users },
                        { id: "comparison", label: "Detailed Comparison", icon: Grid3X3 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<Users size={24} />}
                            label="Total Vendors"
                            value={stats.totalVendors}
                            sublabel={`${stats.submittedCount} submitted proposals`}
                        />
                        <StatCard
                            icon={<DollarSign size={24} />}
                            label="Original Budget"
                            value={formatAmount(mockTenderData.boq.total_amount)}
                            sublabel="Project estimate"
                        />
                        <StatCard
                            icon={<Target size={24} />}
                            label="Lowest Bid"
                            value={formatAmount(stats.lowestAmount)}
                            sublabel="Best offer received"
                            trend={-((mockTenderData.boq.total_amount - stats.lowestAmount) / mockTenderData.boq.total_amount * 100).toFixed(1)}
                        />
                        <StatCard
                            icon={<TrendingDown size={24} />}
                            label="Potential Savings"
                            value={formatAmount(stats.savings)}
                            sublabel="Cost reduction"
                        />
                    </div>

                    {/* Quick Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <BarChart3 size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Bid Analysis</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average Bid:</span>
                                    <span className="font-semibold">{formatAmount(stats.averageAmount)}</span>
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
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <CheckCircle size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Status Summary</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Submitted:</span>
                                    <span className="font-semibold text-blue-600">{stats.submittedCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Under Negotiation:</span>
                                    <span className="font-semibold text-amber-600">{stats.negotiationCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Response Rate:</span>
                                    <span className="font-semibold text-green-600">
                                            {Math.round((stats.submittedCount / stats.totalVendors) * 100)}%
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Vendors Preview */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Top 3 Proposals</h3>
                                <button
                                    onClick={() => setActiveTab("vendors")}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View All Proposals →
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {sortedVendors.slice(0, 3).map((submission, index) => (
                                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{submission.vendor.full_name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Award size={10} className="text-blue-500" />
                                                    {submission.vendor.awarded_tenders} tenders
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Bid:</span>
                                                <span className="font-bold">{formatAmount(submission.total_amount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Awards:</span>
                                                <div className="flex items-center gap-1">
                                                    <Award size={12} className="text-blue-500" />
                                                    <span>{submission.vendor.awarded_tenders}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "vendors" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Vendor Proposals</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search vendors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                                    showFilters || getActiveFiltersCount() > 0
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Filter size={16} />
                                Filters
                                {getActiveFiltersCount() > 0 && (
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                                            {getActiveFiltersCount()}
                                        </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {showFilters && <FilterPanel />}

                    {filteredVendors.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
                            <p className="text-gray-600 mb-6">
                                No vendors match your current search and filter criteria.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {sortedVendors.map((submission, index) => (
                                <VendorCard key={submission.id} submission={submission} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "comparison" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Detailed Comparison</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Download size={16} />
                            Export Comparison
                        </button>
                    </div>

                    <ComparisonTable />

                    {/* Item-wise comparison */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">Item-wise Rate Comparison</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Original Rate</th>
                                    {sortedVendors.map((vendor) => (
                                        <th key={vendor.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            {vendor.vendor.full_name}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {mockTenderData.boq.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.item_no} | {item.quantity} {item.unit}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-semibold text-gray-900">{formatAmount(item.rate, mockTenderData.boq.currency)}</div>
                                        </td>
                                        {sortedVendors.map((vendor) => {
                                            const vendorItem = vendor.items.find(vi => vi.item_id === item.id);
                                            const isLowest = vendorItem && sortedVendors.every(v => {
                                                const otherItem = v.items.find(vi => vi.item_id === item.id);
                                                return !otherItem || vendorItem.rate <= otherItem.rate;
                                            });

                                            return (
                                                <td key={vendor.id} className="px-4 py-4 text-center">
                                                    <div className={`font-semibold ${isLowest ? 'text-green-600 bg-green-50 px-2 py-1 rounded' : 'text-gray-900'}`}>
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
                </div>
            )}
        </div>

        {/* Modals */}
        <AwardModal />
        <NegotiationModal />
    </div>
);
};

export default CivilTenderComparisonDetail;