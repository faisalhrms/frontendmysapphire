import React from 'react';
import CountUp from 'react-countup';

const statusBgColors = {
    available_in_inventory: 'bg-amber-50',
    sold_to_employee: 'bg-emerald-50',
    functional: 'bg-lime-50',
    faulty: 'bg-sky-50',
    lost: 'bg-rose-50',
    temporary_allocation: 'bg-fuchsia-50',
    total_assets: 'bg-cyan-50',
    write_off: 'bg-zinc-50',
    brand_new: 'bg-violet-50',
    no_status: 'bg-slate-50',
};

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

const EquipmentStatusCard = ({ item, currentFilters, onCardClick }) => {
    const { status, count } = item;

    const label = status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

    const iconUrl = getStatusIcon(status);
    const bgColor = statusBgColors[status] || 'bg-white';

    const handleClick = () => {
        if (typeof onCardClick === 'function') {
            onCardClick(status);
        }
    };

    return (
        <div
            className={`p-3 flex items-center transition-transform transform hover:scale-105 cursor-pointer rounded-xl shadow-sm ${bgColor}`}
            onClick={handleClick}
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
