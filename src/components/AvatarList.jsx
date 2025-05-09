import React from "react";
import Tooltip from '@components/Tooltip.jsx';
import placeholder from "@assets/images/faces/avatar.webp";

const generateId = () => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const AvatarList = ({ users, max = 8, size = 'sm', type = 'avatar-rounded' }) => {
    const tooltipIds = React.useMemo(() => {
        return users.map(() => generateId());
    }, [users]);

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[1][0]).toUpperCase();
    };

    const numAvatarsToShow = Math.max(3, Math.floor(Math.random() * max));
    const visibleAvatars = users.slice(0, numAvatarsToShow);
    const remainingUsers = users.length - numAvatarsToShow;

    return (
        <div className="avatar-list-stacked">
            {visibleAvatars.map((user, index) => (
                <span key={`${user.id}-${index}`} className={`avatar avatar-${size} ${type}`}>
          {user.avatar ? <img
                  src={user.avatar ? user.avatar?.small_url : placeholder}
                  alt={user.full_name}
                  data-tooltip-id={tooltipIds[index]}
                  data-tooltip-content={user.full_name}
                  className="cursor-pointer"
              /> :
              <span
                  data-tooltip-id={tooltipIds[index]}
                  data-tooltip-content={user.full_name}
                  className={` flex cursor-pointer   ti-btn-primary  rounded-full  items-center justify-center w-full h-full `}>

                  {getInitials(user.full_name)}



                </span>
          }
                    <Tooltip
                        id={tooltipIds[index]}
                        tooltipContent={user.full_name}
                    />
        </span>
            ))}
            {remainingUsers > 0 && (
                <span className={` avatar bg-primary text-white text-[0.65rem] font-normal avatar-${size} ${type}`}>
          +{remainingUsers}
        </span>
            )}
        </div>
    );
};

export default AvatarList;
