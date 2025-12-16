import CouponInquiryPage from "./views/CouponInquiryPage.jsx";

export const COUPON_INQUIRY_ROUTES = {
    READ: {
        path: '/module/coupon-inquiry',
        permission:"auth.coupon_inquiry"
    }

};

export const MODULE_ROUTES = [
    {
        path: COUPON_INQUIRY_ROUTES.READ.path,
        component: CouponInquiryPage,
        permission:COUPON_INQUIRY_ROUTES.READ.permission
    },

];
