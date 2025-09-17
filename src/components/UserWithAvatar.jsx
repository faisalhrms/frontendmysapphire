import Avatar from "@components/Avatar.jsx";
import React from "react";

const UserWithAvatar = ({user}) => {
    if (!user) return "";
    return (
        <div className="flex items-center">
            <Avatar
                avatar={user?.avatar ? user?.avatar : null}
                full_name={user?.full_name || 'N A'}
                size='md'
                parentClasses='dark:text-gray-200 dark:bg-bodybg'
            />
            <div className='ms-2'>
                <p className="font-semibold mb-0 flex items-center">
                    {user?.full_name || 'N/A'}
                </p>
                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    {user?.email || 'N/A'}
                </p>
            </div>
        </div>
    )
}

export default React.memo(UserWithAvatar);