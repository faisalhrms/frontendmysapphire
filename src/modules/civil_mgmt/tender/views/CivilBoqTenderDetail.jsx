import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {
    HardDrive,
    FileText,
    Package2,
    CheckCircle2,
    XCircle,
    Building2,
    DollarSign,
    Target,
    Users,
    Calendar,
    Clock,
    User,
    Mail,
    Handshake
} from "lucide-react";
import { formatAmountWithCommas } from "@helpers/formatters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import BoqStatCard from "@modules/civil_mgmt/boq/components/BoqStatCard.jsx";
import BoqItemsCard from "@modules/civil_mgmt/boq/components/BoqItemsCard.jsx";
import BoqSiteCard from "@modules/civil_mgmt/boq/components/BoqSiteCard.jsx";
import BoqAttachmentsCard from "@modules/civil_mgmt/boq/components/BoqAttachmentsCard.jsx";

const CivilTenderDetail = () => {
    const { id } = useParams();

    const { data: tenderData, isLoading, error } = useQuery({
        queryKey: ['civil-tender-detail', id],
        queryFn: async () => {
            const { data } = await api.get(`/civil/boq-tenders/${id}/detail/`);
            return data.data;
        },
        enabled: !!id,
        cacheTime: 0,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <EmptyState icon={XCircle} heading="Unable to Load Tender" description={error?.message} />
        );
    }

    if (!tenderData) {
        return (
            <EmptyState icon={Package2} heading="Tender Not Found" description="The requested tender could not be located in our system" />
        );
    }

    const getStatusConfig = (status) => {
        const configs = {
            draft: {
                bg: 'bg-warning/10',
                text: 'text-warning',
                border: 'border-warning',
                dot: 'bg-warning',
                label: 'Draft'
            },
            open: {
                bg: 'bg-primary/10',
                text: 'text-primary',
                border: 'border-primary',
                dot: 'bg-primary',
                label: 'Open'
            },
            awarded: {
                bg: 'bg-success/10',
                text: 'text-success',
                border: 'border-success',
                dot: 'bg-success',
                label: 'Awarded'
            },
            cancelled: {
                bg: 'bg-danger',
                text: 'text-danger',
                border: 'border-danger',
                dot: 'bg-danger',
                label: 'Cancelled'
            }
        };
        return configs[status] || configs.draft;
    };

    const StatusBadge = ({ status }) => {
        const config = getStatusConfig(status);
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text} border ${config.border}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
                {config.label}
            </div>
        );
    };

    const VendorCard = ({ vendor }) => (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-gray-50/50 transition-all duration-200 dark:text-gray-200 dark:bg-bodybg">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center ">
                {vendor.avatar ? (
                    <img
                        src={vendor.avatar.small_url || vendor.avatar.file_url}
                        alt={vendor.full_name}
                        className="w-10 h-10 rounded-lg object-cover"
                    />
                ) : (
                    <User size={16} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate dark:text-gray-200 dark:bg-bodybg">
                    {vendor.full_name}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 dark:text-gray-200 dark:bg-bodybg">
                    <Mail size={10} />
                    {vendor.email}
                </div>
            </div>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading={
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">{tenderData.boq?.site?.name}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-600">{tenderData.boq?.project?.name}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-900 font-bold">{tenderData.title}</span>
                    </div>
                }
                description={`Tender Details • Created ${tenderData.created_at}`}
                icon={HardDrive}
                children={
                    <div className="flex items-center gap-4">
                        <StatusBadge status={tenderData.status} />
                    </div>
                }
            />

            <div className="space-y-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <BoqStatCard
                        icon={<Package2 size={20} />}
                        label="Total Items"
                        value={tenderData.boq?.items?.length || 0}
                        sublabel="BOQ items"
                    />
                    <BoqStatCard
                        icon={<DollarSign size={20} />}
                        label="Total Amount"
                        value={formatAmountWithCommas(tenderData.boq?.total_amount || 0)}
                        sublabel="Project cost"
                    />
                    <BoqStatCard
                        icon={<Users size={20} />}
                        label="Vendors"
                        value={tenderData.vendors?.length || 0}
                        sublabel="Invited vendors"
                    />
                    <BoqStatCard
                        icon={<Calendar size={20} />}
                        label="Duration"
                        value={`${new Date(tenderData.ended_at).getDate() - new Date(tenderData.started_at).getDate()} days`}
                        sublabel="Tender period"
                    />
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <BoqItemsCard itemData={tenderData.boq} />
                    </div>

                    <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-0 self-start">
                        <div className="box">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                <div className="flex items-center gap-2">
                                    <Handshake size={16} className="text-gray-600"/>
                                    <h6>Tender Information</h6>
                                </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                            <Calendar size={16}/>
                                        </div>
                                        <div>
                                            <div
                                                className="font-medium text-sm text-gray-900">{tenderData.started_at}</div>
                                            <div className="text-xs text-gray-500">Start Date</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                            <Clock size={16}/>
                                        </div>
                                        <div>
                                            <div
                                                className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{tenderData.ended_at}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">End Date</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusConfig(tenderData.status).bg} ${getStatusConfig(tenderData.status).text}`}>
                                            <Target size={16}/>
                                        </div>
                                        <div>
                                            <div
                                                className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{getStatusConfig(tenderData.status).label}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">Status</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {tenderData.vendors && tenderData.vendors.length > 0 && (
                            <div className="box">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-600 dark:text-gray-200 dark:bg-bodybg"/>
                                        <h6>Invited Vendors</h6>
                                        <div className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg">
                                            {tenderData.vendors.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {tenderData.vendors.map((vendor) => (
                                            <VendorCard key={vendor.id} vendor={vendor} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                       <BoqSiteCard site={tenderData.boq?.site}  />

                        <div className="box">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-gray-600"/>
                                    <h6>Project Information</h6>
                                </div>
                            </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                            <Building2 size={16}/>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                                {tenderData.boq?.project?.name || 'No Project'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">Project Name</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                            <FileText size={16}/>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                                {tenderData.boq?.title || 'No BOQ'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">BOQ Title</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            tenderData.boq?.is_finalized
                                                ? 'bg-success/10 text-success'
                                                : 'bg-warning/10 text-warning'
                                        }`}>
                                            {tenderData.boq?.is_finalized ?
                                                <CheckCircle2 size={16}/> :
                                                <XCircle size={16}/>
                                            }
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                                {tenderData.boq?.is_finalized ? 'Finalized' : 'Draft'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">BOQ Status</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <BoqAttachmentsCard attachments={tenderData.boq?.project_drawings} heading="Project Drawings" />
                            <BoqAttachmentsCard attachments={tenderData.attachments} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CivilTenderDetail;