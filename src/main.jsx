import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import './index.scss';
import Login from "@modules/auth/views/Login.jsx";
import store from './redux/store';
import ScrollToTop from "@modules/layouts/includes/ScrollToTop.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import AppRoutes from "./routes/AppRoutes.jsx";
import Authentication from "@modules/layouts/Authentication.jsx";
import Error from "@modules/errors/Error.jsx";
import App from "@modules/layouts/App.jsx";
import Toast from "@components/Toast.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ForgotPassView from "@modules/auth/views/ForgotPassView.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 10 * 60 * 1000, // 10 minutes
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            refetchOnMount: true,
        },
        mutations: {
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter>
                    <ScrollToTop/>
                    <Routes>
                        {/* Authentication Layout for Login and related routes */}
                        <Route path={`${import.meta.env.BASE_URL}`} element={<Authentication/>}>
                            <Route index element={<Login/>}/>
                            <Route path="resetpassword" element={<ForgotPassView/>}/>
                            <Route path="resetpassword/:uidb64/:token" element={<ForgotPassView />} />
                        </Route>

                        {/* Error Route */}
                        <Route path={`${import.meta.env.BASE_URL}/error/:code`} element={<Error/>}/>

                        {/* Main App Layout */}
                        <Route path={`${import.meta.env.BASE_URL}`} element={<App/>}>
                            <Route path="*" element={<AppRoutes/>}/>
                        </Route>
                    </Routes>
                    <Toast/>
                </BrowserRouter>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </React.Fragment>
);
