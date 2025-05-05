import DailySaleReportList from "@modules/DailyReport/views/DailySaleReportList.jsx";
import ClassOfflineOnlineFiscalList from "@modules/DailyReport/views/ClassOfflineOnlineFiscalList.jsx";
import OfflineStorePerformList  from "@modules/DailyReport/views/OfflineStorePerformList.jsx";
export const DAILYREPORT_ROUTES = {
    READ: {
        path: "/retail/daily-sales-report",
        permission: "auth.view_dailyreport",
    },
    CREATE:{
        path: "/retail/comparative-sales-report",
        permission: "auth.view_comparativesalesreport",

    },



};

export const OFFLINE_STORE_PERFORMANCE_ROUTE={
    READ:{
        path:"/retail/offline-store-performance",
        permission:"auth.view_offline_store_performance_report"
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
        component: ClassOfflineOnlineFiscalList,
        permission: DAILYREPORT_ROUTES.CREATE.permission,

    },
    {
        path:OFFLINE_STORE_PERFORMANCE_ROUTE.READ.path,
        component:OfflineStorePerformList
    }


];
