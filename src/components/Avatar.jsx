import React, { useMemo } from "react";
import Tooltip from "@components/Tooltip.jsx";

const Avatar = ({
                    avatar,
                    full_name = '',
                    classes = '',
                    parentClasses = '',
                    size = 'sm',
                    shape = 'rounded',
                    id = null,
                    backgroundColor = ""
                }) => {
    const bgColors = [' bg-primary'];

    const getRandomColor = (colorArray) => {
        const randomIndex = Math.floor(Math.random() * colorArray.length);
        return colorArray[randomIndex];
    };

    const randomBgColor = useMemo(() => getRandomColor(bgColors), []);

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[1][0]).toUpperCase();
    };

    const tooltipId = useMemo(() => {
        return `tooltip-${id || full_name.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`;
    }, [id, full_name]);

    return (
        <span className={`avatar avatar-${shape} avatar-${size} ${parentClasses} ${backgroundColor} `}>
            {avatar && avatar?.small_url ? (
                <img
                    className={classes}
                    src={avatar.small_url}
                    alt={avatar.file_name || 'Image'}
                    data-tooltip-id={tooltipId}
                    data-tooltip-content={full_name}
                />
            ) : (
                <span
                    data-tooltip-id={tooltipId}
                    data-tooltip-content={full_name}
                    className={`flex cursor-pointer ${randomBgColor} hover:bg-none rounded-full items-center justify-center w-full h-full`}>
                    {getInitials(full_name)}
                </span>
            )}
            <Tooltip
                id={tooltipId}
                tooltipContent={full_name}
            />
        </span>
    );
};

export default React.memo(Avatar);
