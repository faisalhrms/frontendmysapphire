import DailySaleReportList from "@modules/DailyReport/views/DailySaleReportList.jsx";


export const DAILYREPORT_ROUTES = {
    READ: {
        path: "/module/dailyreport",
        permission: "view_dailyreport",
    },



};

export const MODULE_ROUTES = [
    {
        path: DAILYREPORT_ROUTES.READ.path,
        component: DailySaleReportList,
        permission: DAILYREPORT_ROUTES.READ.permission,
    },


];
