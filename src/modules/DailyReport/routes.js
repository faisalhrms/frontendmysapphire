import DailySaleReportList from "@modules/DailyReport/views/DailySaleReportList.jsx";
import ClassOfflineOnlineFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import ClassOfflineOnlineFiscalList from "@modules/DailyReport/views/ClassOfflineOnlineFiscalList.jsx";


export const DAILYREPORT_ROUTES = {
    READ: {
        path: "/module/dailyreport",
        permission: "view_dailyreport",
    },
    CREATE:{
        path: "/module/cf",
        permission: "view_classfasical",

    },



};

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


];
