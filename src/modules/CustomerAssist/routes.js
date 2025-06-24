import CustomerAssist from "@modules/CustomerAssist/views/CustomerAssist.jsx";
import CustomerAssistDetail from "@modules/CustomerAssist/views/CustomerAssistDetail.jsx";
import CustomerAssistEdit from "@modules/CustomerAssist/views/CustomerAssistEdit.jsx";

export const CUSTOMER_ASSIST_ROUTES={
READ:{
    path:'/customer-assist/detail',
    permission: `customer_assist.view_customerassistcase`
},
    DETAIL:{
        path:'/customer-assist/detail/:id',
         permission: "customer_assist.view_customerassistcase",

    },
    EDIT:{
        path:'/customer-assist/edit/:id',
        permission: "customer_assist.change_customerassistcase",

    }
}
export const MODULE_ROUTES=[
    {
        path:CUSTOMER_ASSIST_ROUTES.READ.path,
        component:CustomerAssist
    },
    {
        path: CUSTOMER_ASSIST_ROUTES.DETAIL.path,
        component:CustomerAssistDetail
    },
    {
        path:CUSTOMER_ASSIST_ROUTES.EDIT.path,
        component:CustomerAssistEdit
    }
]