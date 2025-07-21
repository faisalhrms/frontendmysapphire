import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

// Background colors per status
const statusBgColors = {
    available_in_inventory: 'bg-amber-100',
    sold_to_employee: 'bg-emerald-100',
    functional: 'bg-lime-100',
    faulty: 'bg-sky-100',
    lost: 'bg-rose-100',
    temporary_allocation: 'bg-fuchsia-100',
    total_assets: 'bg-cyan-100',
    write_off: 'bg-red-100',
    brand_new: 'bg-violet-100',
    no_status: 'bg-slate-100',
};

// Get icon path
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

        navigate(`/module/asset/home?${params.toString()}`);
    };

    return (
        <div
            className={`p-3 flex  items-center transition-transform transform hover:scale-105 cursor-pointer rounded-xl shadow-sm ${bgColor}`}
            onClick={handleCardClick}
        >
            <div className="w-12 h-12 flex-shrink-0 mr-4">
                {iconUrl && (
                    <img
                        src={iconUrl}
                        alt={label}
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base font-medium text-gray-800 leading-snug">
                    {label}
                </div>
                <div className="text-xl font-bold text-primary">
                    <CountUp end={count} />
                </div>
            </div>
        </div>
    );
};

export default EquipmentStatusCard;
