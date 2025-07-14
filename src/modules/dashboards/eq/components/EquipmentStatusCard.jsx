import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

// Light background colors by status
const statusBgColors = {
    available_in_inventory: 'bg-amber-50',
    sold_to_employee: 'bg-emerald-50',
    functional: 'bg-lime-50',
    faulty: 'bg-amber-50',
    lost: 'bg-rose-50',
    temporary_allocation: 'bg-fuchsia-50',
    total_assets: 'bg-lime-50',
    write_off: 'bg-rose-50',
    brand_new:'bg-violet-50',
};

// Helper to load status icon
const getStatusIcon = (status) => {
    try {
        return new URL(
            `/src/assets/images/assets-logo/${status}_icon.png`,
            import.meta.url
        ).href;
    } catch (e) {
        console.warn(`Icon not found for status: ${status}`);
        return null;
    }
};

const EquipmentStatusCard = ({ item, currentFilters }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { status, count } = item;

    const label = status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

    const iconUrl = getStatusIcon(status);
    const bgColor = statusBgColors[status] || 'bg-white';

    const handleCardClick = () => {
        const params = new URLSearchParams(location.search);
        params.set('status', status);

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value && key !== 'status') params.set(key, value);
        });

        navigate(`/module/asset?${params.toString()}`);
    };

    return (
        <div
            className={`p-3 flex flex-col  items-start transition-transform transform hover:scale-105 cursor-pointer rounded-xl shadow-sm ${bgColor}`}
            onClick={handleCardClick}
        >
            <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10">
                    {iconUrl && (
                        <img
                            src={iconUrl}
                            alt={label}
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>
                <div className="text-base font-medium text-gray-800">
                    {label}
                </div>
            </div>
            <div className="mt-3 w-full flex justify-center">
                <p className="text-xl font-bold text-primary">
                    <CountUp end={count} />
                </p>
            </div>
        </div>
    );
};

export default EquipmentStatusCard;
