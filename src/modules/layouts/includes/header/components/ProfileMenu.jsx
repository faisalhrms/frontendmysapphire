import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {logout} from "@modules/auth/redux/authSlice.js";
import Avatar from "@components/Avatar.jsx";

const ProfileMenu = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate(`${import.meta.env.BASE_URL}`);
    };

    return (
        <>
            <div className="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]">
                <button id="dropdown-profile" type="button"
                    className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent ">
                    <Avatar avatar={user?.avatar} classes='online' />
                </button>
                <div className="md:block hidden dropdown-profile cursor-pointer">
                    <p className="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] ">
                        {user?.full_name || 'Anonymous User'}
                    </p>
                    <span className="opacity-[0.7] font-normal text-[#536485] block text-[0.6875rem] ">{user?.designation?.name}</span>
                </div>
                <div
                    className="hs-dropdown-menu ti-dropdown-menu !-mt-3 border-0 w-[11rem] !p-0 border-defaultborder hidden main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
                    aria-labelledby="dropdown-profile">

                    <ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
                        <li>
                            <Link
                                className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex"
                                to={`${import.meta.env.BASE_URL}pages/profile/`}>
                                <i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7]"></i>Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0  !p-[0.65rem] !inline-flex"
                                to={`${import.meta.env.BASE_URL}module/task/kanban-board`}>
                                <i className="ti ti-clipboard text-[1.125rem] me-2 opacity-[0.7]"></i>Task Manager
                            </Link>
                        </li>

                        <li><Link
                            className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                            to={`${import.meta.env.BASE_URL}`}
                            onClick={handleLogout}>
                            <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>Log Out
                        </Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ProfileMenu;
