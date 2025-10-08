import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {
    HardDrive,
    Edit3,
    FileText,
    Package2,
    Calculator,
    CheckCircle2,
    XCircle,
    Download,
    Eye,
    Building2,
    Hash,
    DollarSign,
    Target,
    Paperclip,
    Grid3X3,
    BarChart3,
} from "lucide-react";
import { formatAmountWithCommas } from "@helpers/formatters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const CivilBoqDetail = () => {
    const { id } = useParams();

    const { data: boqData, isLoading, error } = useQuery({
        queryKey: ['civil-boq-detail', id],
        queryFn: async () => {
            const { data } = await api.get(`/civil/boq/${id}/detail/`);
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
            <EmptyState icon={XCircle} heading="Unable to Load BOQ" description={error?.message} />
        );
    }

    if (!boqData) {
        return (
            <EmptyState icon={Package2} heading="BOQ Not Found" description="The requested BOQ could not be located in our system" />
        );
    }

    const StatusBadge = ({ isFinalized }) => (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isFinalized
                ? 'bg-success/10 text-success border border-success'
                : 'bg-warning/10 text-warning border border-warning'
        }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isFinalized ? 'bg-success' : 'bg-warning'}`}></div>
            {isFinalized ? 'Finalized' : 'Draft'}
        </div>
    );

    const StatCard = ({ icon, label, value, sublabel }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-primary/20 hover:shadow-sm transition-all duration-200 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center border border-gray-200 justify-center dark:text-gray-200 dark:bg-bodybg">
                    {icon}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">{label}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 dark:text-gray-200 dark:bg-bodybg">{value}</div>
            {sublabel && <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{sublabel}</div>}
        </div>
    );

    const ItemRow = ({ item, index, currency }) => (
        <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-4 text-sm">
                <div className="w-6 h-6 bg-primary/10 text-primary text-xs font-medium rounded flex items-center justify-center">
                    {index + 1}
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 text-xs font-mono rounded  dark:text-gray-200 dark:bg-bodybg">
                        <Hash size={10} />
                        {item.item_no}
                    </div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{item.name}</div>
                </div>
            </td>
            <td className="px-4 py-4 text-center">
                <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                    {item.unit}
                </span>
            </td>
            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                {item.quantity.toLocaleString()}
            </td>
            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                {formatAmountWithCommas(item.rate)}
            </td>
            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                {formatAmountWithCommas(item.amount)}
            </td>
        </tr>
    );

    const AttachmentItem = ({ attachment }) => {
        const isImage = attachment.file_type === 'image';
        const fileSizeKB = (attachment.file_size / 1024).toFixed(1);

        return (
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-gray-50/50 transition-all duration-200 group dark:text-gray-200 dark:bg-bodybg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isImage ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                }`}>
                    <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate ">
                        {attachment.file_name}.{attachment.file_extension}
                    </div>
                    <div className="text-xs text-gray-500">
                        {fileSizeKB} KB • {attachment.file_type}
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => window.open(attachment.file_url, '_blank')}
                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="View"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.file_url;
                            link.download = `${attachment.file_name}.${attachment.file_extension}`;
                            link.click();
                        }}
                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Download"
                    >
                        <Download size={14} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <IconPageHeader
                heading={
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">{boqData.site?.name}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-600">{boqData.project?.name}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-900 font-bold">{boqData.title}</span>
                    </div>
                }
                description={`Version ${boqData.version} • BOQ Details • Created ${boqData.created_at}`}
                icon={HardDrive}
                children={
                    <div className="flex items-center gap-4">
                        <StatusBadge isFinalized={boqData.is_finalized} />
                    </div>
                }
            />

            <div className="space-y-6 pb-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Package2 size={20} />}
                        label="Total Items"
                        value={boqData.items?.length || 0}
                        sublabel="Construction items"
                    />
                    <StatCard
                        icon={<DollarSign size={20} />}
                        label="Total Amount"
                        value={`${boqData.currency} ${formatAmountWithCommas(boqData.total_amount || 0)}`}
                        sublabel="Project cost"
                    />
                    <StatCard
                        icon={<Target size={20} />}
                        label="Version"
                        value={`v${boqData.version}`}
                        sublabel={boqData.is_finalized ? 'Finalized' : 'Draft'}
                    />
                    <StatCard
                        icon={<BarChart3 size={20} />}
                        label="Avg. Item Cost"
                        value={boqData.items?.length ?  boqData.currency + ' ' + formatAmountWithCommas(Math.round((boqData.total_amount || 0) / boqData.items.length)) : '0'}
                        sublabel="Per item average"
                    />
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="box">
                                <div className="box-header justify-between px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                                <Grid3X3 size={16}/>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">BOQ Items</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">Construction items breakdown</p>
                                            </div>
                                        </div>
                                        <div
                                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg">
                                            {boqData.items?.length || 0} items
                                        </div>
                                    </div>
                                </div>

                            {boqData.items && boqData.items.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg ">
                                                    #
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                                    Item Details
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                                    Unit
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                                    Quantity
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                                    Rate
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                                    Amount
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100 dark:text-gray-200 dark:bg-bodybg">
                                            {boqData.items.map((item, index) => (
                                                <ItemRow key={item.id} item={item} index={index} currency={boqData.currency} />
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Grand Total */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                        <div className="flex justify-end">
                                            <div
                                                className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-l dark:text-gray-200 dark:bg-bodybg">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                                        <Calculator size={16}/>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Grand Total</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">Final amount</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-primary">
                                                    {boqData.currency} {formatAmountWithCommas(boqData.total_amount || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Package2 className="w-8 h-8 text-gray-400"/>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">No Items Found</h4>
                                    <p className="text-gray-600">This BOQ doesn't have any items yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-0 self-start">
                        {boqData.site && (
                            <div className="box">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                    <h6>Site Information</h6>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{boqData.site.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{boqData.site.address}</div>
                                    </div>

                                    {/* Map */}
                                    {boqData.site.latitude && boqData.site.longitude && (
                                        <div className="h-56 w-full rounded-lg overflow-hidden border border-gray-200">
                                            <MapContainer
                                                center={[boqData.site.latitude, boqData.site.longitude]}
                                                zoom={15}
                                                style={{ height: "100%", width: "100%" }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={[boqData.site.latitude, boqData.site.longitude]}>
                                                    <Popup>
                                                        <strong>{boqData.site.name}</strong>
                                                        <br />
                                                        {boqData.site.address}
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="box">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                <h6>Project Information</h6>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                        <Building2 size={16}/>
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                            {boqData.project?.name || 'No Project'}
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
                                        <div
                                            className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">Version {boqData.version}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">BOQ Version</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        boqData.is_finalized
                                            ? 'bg-success/10 text-success'
                                            : 'bg-warning/10 text-warning'
                                    }`}>
                                        {boqData.is_finalized ?
                                            <CheckCircle2 size={16}/> :
                                            <XCircle size={16}/>
                                        }
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                            {boqData.is_finalized ? 'Finalized' : 'Draft'}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {boqData.attachments && boqData.attachments.length > 0 && (
                            <div className="box">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                                    <div className="flex items-center gap-2 dark:text-gray-200 dark:bg-bodybg">
                                        <Paperclip size={16} className="text-gray-600 dark:text-gray-200 dark:bg-bodybg"/>
                                        <h6>Attachments</h6>
                                        <div
                                            className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                                            {boqData.attachments.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {boqData.attachments.map((attachment) => (
                                            <AttachmentItem key={attachment.id} attachment={attachment} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CivilBoqDetail;