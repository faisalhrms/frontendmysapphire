import PoliciesAdd from "@modules/policies/views/PoliciesAdd.jsx";
import PoliciesEdit from "@modules/policies/views/PoliciesEdit.jsx";
import InlayList from "@modules/inlay/views/InlayList.jsx";
import InlayAdd from "@modules/inlay/views/InlayAdd.jsx";
import InlayEdit from "@modules/inlay/views/InlayEdit.jsx";
import InlayDetail from "@modules/inlay/views/InlayDetail.jsx";

export const INLAY_ROUTES = {
    READ:{
        path:'/module/inlay',
        permission:'inlay.view_inlay'
    },
    ADD:{
        path:'/module/inlay/add',
        permission:'inlay.add_inlay'
    },
    EDIT:{
        path:'/module/inlay/edit/:id',
        permission:'inlay.change_inlay'
    },
    DETAIL:{
        path:'/module/inlay/detail/:id',
        permission:'inlay.view_inlay'
    }


}

export const MODULE_ROUTES = [
    {
        path:INLAY_ROUTES.READ.path,
        component:InlayList,
        permission: INLAY_ROUTES.READ.permission,
    },
    {
        path:INLAY_ROUTES.ADD.path,
        component:InlayAdd,
        permission: INLAY_ROUTES.ADD.permission,
    },
    {
        path:INLAY_ROUTES.EDIT.path,
        component:InlayEdit,
        permission: INLAY_ROUTES.EDIT.permission,
    },
    {
        path:INLAY_ROUTES.DETAIL.path,
        component:InlayDetail,
        permission: INLAY_ROUTES.DETAIL.permission,
    }
]
