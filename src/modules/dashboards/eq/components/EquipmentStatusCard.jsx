import React from 'react';
import CountUp from 'react-countup';
import { colorPalette } from '@helpers/styles.js';

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

const getStatusBgColor = (statusKey) => {
    const map = {
        available_in_inventory: 'yellow',
        sold_to_employee: 'pink',
        functional: 'success',
        faulty: 'secondary',
        lost: 'danger',
        temporary_allocation: 'purple',
        total_assets: 'cyan',
        write_off: 'warning',
        brand_new: 'indigo',
        no_status: 'orange',
    };


    const paletteKey = map[statusKey] || 'default';
    return colorPalette[paletteKey]?.background || 'bg-white';
};

const EquipmentStatusCard = ({ item, currentFilters, onCardClick }) => {
    const { status, count } = item;

    const label = status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

    const iconUrl = getStatusIcon(status);
    const bgColor = getStatusBgColor(status);

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
                <div className="text-base font-medium leading-snug">
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
