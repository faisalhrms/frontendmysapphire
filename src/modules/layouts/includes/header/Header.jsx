import { Fragment } from 'react';
import HeaderLogo from "./components/HeaderLogo.jsx";
import SidebarToggle from "./components/SidebarToggle.jsx";
import ThemeModeToggle from "./components/ThemeModeToggle.jsx";
import FullScreenToggle from "./components/FullScreenToggle.jsx";
import ProfileMenu from "./components/ProfileMenu.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";
import BrandBookLink from "@modules/layouts/includes/header/components/BrandBookLink.jsx";
import OdooSSOButton from "@modules/layouts/includes/header/components/OdooSSOButton.jsx";

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
                                {/*<OdooSSOButton />*/}
                                <ThemeModeToggle/>
                                <BrandBookLink
                                    to={SELF_SERVICES_ROUTES.SERVICES.BRAND_BOOK.path}
                                    title="View Brand Book"
                                />
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
