import DailySaleReportList from "@modules/DailyReport/views/DailySaleReportList.jsx";

import OfflineStorePerformList  from "@modules/DailyReport/views/OfflineStorePerformList.jsx";
import ComparativeSaleReportList from "@modules/DailyReport/views/ComparativeSaleReportList.jsx";
import UploadTarget from "@modules/DailyReport/views/UploadTarget.jsx";
export const DAILYREPORT_ROUTES = {
    READ: {
        path: "/module/retail/daily-sales-report",
        permission: "auth.view_dailyreport",
    },
    CREATE:{
        path: "/module/retail/comparative-sales-report",
        permission: "auth.view_comparativesalesreport",
    },



};

export const OFFLINE_STORE_PERFORMANCE_ROUTE={
    READ:{
        path:"/module/retail/offline-store-performance",
        permission:"auth.view_offline_store_performance_report"
    }
}
export const UPLOAD_TARGET_ROUTE={
    ADD:{
        path:"/module/retail/target-upload",
         permission: "auth.target-upload",
    }
}
export const MODULE_ROUTES = [
    {
        path: DAILYREPORT_ROUTES.READ.path,
        component: DailySaleReportList,
        permission: DAILYREPORT_ROUTES.READ.permission,
    },
    {
        path: DAILYREPORT_ROUTES.CREATE.path,
        component: ComparativeSaleReportList,
        permission: DAILYREPORT_ROUTES.CREATE.permission,

    },
    {
        path:OFFLINE_STORE_PERFORMANCE_ROUTE.READ.path,
        component:OfflineStorePerformList,
        permission: OFFLINE_STORE_PERFORMANCE_ROUTE.READ.permission,
    },
    {
        path:UPLOAD_TARGET_ROUTE.ADD.path,
        component:UploadTarget,
        permission: UPLOAD_TARGET_ROUTE.ADD.permission,
    }


];
