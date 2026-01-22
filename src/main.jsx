import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Provider, useSelector} from 'react-redux';
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
import ForgotPassView from "@modules/auth/views/ForgotPassView.jsx";
import VCardProfile from "@modules/digital-profiles/views/VCardProfile.jsx";
import ResetPassView from "@modules/auth/views/ResetPassView.jsx";
import PublicDynamicForm from "@modules/forms/views/PublicDynamicForm.jsx";
import PrivacyPolicy from "@modules/forms/views/PrivacyPolicy.jsx";
import PublicInlay from "@modules/inlay/views/PublicInlay.jsx";
import ToDetailPage from "@modules/public/views/ToDetailPage.jsx";
import AboutUs from "@modules/public/views/AboutUs.jsx";
import CartonDetailPage from "@modules/carton/view/CartonDetailPage.jsx";
import PublicRequisitionApply from "./modules/requisition/views/PublicRequisitionApply.jsx";
import Careers from "./modules/public/views/Careers.jsx";
import JobDetail from "./modules/public/views/JobDetail.jsx";
import OfferResponse from "@modules/requisition/views/OfferResponse.jsx";

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

// A guard for routes requiring password reset
const PasswordResetGuard = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const tokens = useSelector((state) => state.auth.tokens);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (user && tokens?.access_token) {
            if (user.password_changed_at === null) {
                navigate(`${import.meta.env.BASE_URL}change-password`, { replace: true });
            }
        } else {
            navigate(`${import.meta.env.BASE_URL}`, {
                replace: true,
                state: { from: location }
            });
        }
    }, [user, tokens, navigate, location]);

    return user && tokens?.access_token ? children : null;
};


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter>
                    <ScrollToTop/>
                    <Routes>
                        <Route path={`${import.meta.env.BASE_URL}`} element={<Authentication />}>
                            <Route index element={<Login />} />
                            <Route path="about-us" element={<AboutUs />} />
                            <Route path="/careers" element={<Careers />} />
                            <Route path="/careers/jobs/:id" element={<JobDetail />} />
                            <Route path="resetpassword" element={<ForgotPassView />} />
                            <Route path="resetpassword/:uidb64/:token" element={<ForgotPassView />} />
                            <Route path="vcard/profile/:id" element={<VCardProfile />} />
                            <Route path="forms/:slug" element={<PublicDynamicForm />} />
                            <Route path="/careers/apply/:slug" element={<PublicRequisitionApply />} />
                            <Route path="/careers/offer-response" element={<OfferResponse />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/inlay/:code" element={<PublicInlay />} />
                            <Route path="transfer-order/delivery/detail/:sdn_id" element={<ToDetailPage />} />
                            <Route path="transfer-order/carton/detail/:id" element={<CartonDetailPage/>} />
                        </Route>

                        {/* Error Page */}
                        <Route path={`${import.meta.env.BASE_URL}/error/:code`} element={<Error />} />

                        {/* Authenticated App Routes */}
                        <Route path={`${import.meta.env.BASE_URL}`} element={
                            <PasswordResetGuard>
                                <App />
                            </PasswordResetGuard>
                        }>
                            <Route path="*" element={<AppRoutes />} />
                        </Route>

                        {/* ✅ Protected Reset Password Route */}
                        <Route path={`${import.meta.env.BASE_URL}change-password`} element={
                            <PasswordResetGuard>
                                <ResetPassView />
                            </PasswordResetGuard>
                        } />
                    </Routes>

                    <Toast/>
                </BrowserRouter>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </React.Fragment>
);

export default PasswordResetGuard;
