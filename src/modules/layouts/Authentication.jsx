
import { Fragment, useEffect  } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import Switcher from "./includes/switcher/Switcher.jsx";

function Authentication() {
    useEffect(() => {
        import("preline");
    }, []);

    return (

        <>
            <HelmetProvider>
                <Helmet>
                    <body className=''></body>
                </Helmet>
                <Switcher />
                <Outlet />
            </HelmetProvider>
        </>
    );
}

export default Authentication;

