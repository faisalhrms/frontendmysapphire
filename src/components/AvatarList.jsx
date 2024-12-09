import Tooltip from '@components/Tooltip.jsx';
import placeholder from "@assets/images/faces/avatar.webp";

const AvatarList = ({ users, max = 8, size = 'sm', type = 'avatar-rounded' }) => {
    const numAvatarsToShow = Math.max(3, Math.floor(Math.random() * max));

    const visibleAvatars = users.slice(0, numAvatarsToShow);
    const remainingUsers = users.length - numAvatarsToShow;

    return (
        <div className={`avatar-list-stacked`}>
            {visibleAvatars.map((user) => (
               <span key={user.id} className={`avatar avatar-${size} ${type}`}>
               <img 
                 src={`${user.avatar ? user.avatar?.small_url : placeholder}`}
                 alt={user.full_name}
                 data-tooltip-id={`tooltip-${user.id}`}
                 data-tooltip-content={user.full_name}
                 className="cursor-pointer"
               />
               <Tooltip
                 id={`tooltip-${user.id}`}
                 tooltipContent={user.full_name}
               />
             </span>
            ))}

            {remainingUsers > 0 && (
                <span className={`avatar bg-primary text-white text-[0.65rem] font-normal avatar-${size} ${type}`}>
                    +{remainingUsers}
                </span>
            )}
        </div>
    );
};

export default AvatarList;
