import React, {Fragment, useEffect} from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {Navigate, Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useIsAuthenticated, usePermissions} from "@modules/auth/hooks/authHooks.js";
import { setPermissions } from "@modules/auth/redux/authSlice.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Switcher from "@modules/layouts/includes/switcher/Switcher.jsx";
import Header from "@modules/layouts/includes/header/Header.jsx";
import Sidebar from "@modules/layouts/includes/sidebar/Sidebar.jsx";
import Footer from "@modules/layouts/includes/Footer.jsx";
import TabToTop from "@modules/layouts/includes/TabToTop.jsx";
import DeleteModal from "@components/modals/DeleteModal.jsx";
import useAnalyticsTracker from "@hooks/useAnalyticsTracker.js";

function App() {
    const isAuthenticated = useIsAuthenticated();
    if (!isAuthenticated) {
        return <Navigate to={`${import.meta.env.BASE_URL}`} />;
    }
    const userId = useSelector((state) => state.auth.user?.id)
    const dispatch = useDispatch();
    const { permissions, isLoading } = usePermissions(userId);

    useEffect(() => {
        import("preline");
    }, []);

    useEffect(() => {
        if (!isLoading) {
            dispatch(setPermissions(permissions));
        }
    }, [permissions, isLoading, dispatch]);

    useAnalyticsTracker();


    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Fragment>
            <div style={{display: `${isLoading ? "none" : "block"}`}}>
                <HelmetProvider>
                    <Helmet
                        htmlAttributes={{
                            'lang': 'en',
                            'dir': 'ltr',
                            'data-menu-styles': 'light',
                            'class': 'light',
                            'data-nav-layout': 'vertical',
                            'data-header-styles': 'light',
                            'data-vertical-style': 'overlay',
                            'loader': 'disable',
                            'data-icon-text': '',
                        }}
                    />
                    <Switcher/>
                    <div className='page'>
                        <Header/>
                        <Sidebar/>
                        <div className='content main-index'>
                            <div className='main-content'>
                                <Outlet />
                            </div>
                        </div>
                        <DeleteModal />
                        <Footer/>
                    </div>
                    <TabToTop />
                </HelmetProvider>
            </div>
        </Fragment>
    );
}

export default App;