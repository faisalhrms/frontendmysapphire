import React from 'react';
import { Link } from 'react-router-dom';
import desktopLogo from '@assets/images/brand-logos/desktop-logo.svg';
import toggleLogo from '@assets/images/brand-logos/toggle-logo.png';
import desktopDark from '@assets/images/brand-logos/desktop-dark.svg';
import toggleDark from '@assets/images/brand-logos/toggle-dark.png';
import desktopWhite from '@assets/images/brand-logos/desktop-white.svg';
import toggleWhite from '@assets/images/brand-logos/toggle-white.png';
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";

const HeaderLogo = () => {
    return (
        <>
            <div className="header-element">
                <div className="horizontal-logo">
                    <Link to={DASHBOARD_ROUTES.PROJECT.path} className="header-logo">
                        <img src={desktopLogo} alt="Logo" className="desktop-logo"/>
                        <img src={toggleLogo} alt="Logo" className="toggle-logo"/>
                        <img src={desktopDark} alt="Logo" className="desktop-dark"/>
                        <img src={toggleDark} alt="Logo" className="toggle-dark"/>
                        <img src={desktopWhite} alt="Logo" className="desktop-white"/>
                        <img src={toggleWhite} alt="Logo" className="toggle-white"/>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default HeaderLogo;
