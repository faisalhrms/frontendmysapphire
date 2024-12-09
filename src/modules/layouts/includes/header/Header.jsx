import { Fragment } from 'react';
import HeaderLogo from "./components/HeaderLogo.jsx";
import SidebarToggle from "./components/SidebarToggle.jsx";
import ThemeModeToggle from "./components/ThemeModeToggle.jsx";
import FullScreenToggle from "./components/FullScreenToggle.jsx";
import ProfileMenu from "./components/ProfileMenu.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import HeaderNotifications from "./components/HeaderNotifications.jsx";

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
