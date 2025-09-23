import { Fragment } from 'react';
import {Link} from "react-router-dom";
import HeaderLogo from "./components/HeaderLogo.jsx";
import SidebarToggle from "./components/SidebarToggle.jsx";
import ThemeModeToggle from "./components/ThemeModeToggle.jsx";
import FullScreenToggle from "./components/FullScreenToggle.jsx";
import ProfileMenu from "./components/ProfileMenu.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import HeaderNotifications from "./components/HeaderNotifications.jsx";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js"; // adjust import

const Header = () => {
    return (
        <>
            <header className="app-header">
                <nav className="main-header !h-[3.75rem]" aria-label="Global">
                    <div className="main-header-container ps-[0.725rem] pe-[1rem]">
                        <div className="header-content-left">
                            <HeaderLogo/>
                            <SidebarToggle/>
                        </div>
                            <div className="header-content-right">
                                <ThemeModeToggle/>
                                <HeaderNotifications/>
                                <Link
                                    to={SELF_SERVICES_ROUTES.SERVICES.BRAND_BOOK.path}
                                    className="header-element py-[1rem] md:px-[0.65rem] px-2 flex-shrink-0 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                                    title="BrandBook"
                                >
                                    <i className="bx bx-book-open header-link-icon text-[0.125rem]"></i>

                                </Link>
                                <FullScreenToggle/>
                                <ProfileMenu/>
                                <ThemeSwitcher/>
                            </div>
                        </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
