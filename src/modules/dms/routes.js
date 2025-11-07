import PoliciesList from "@modules/policies/views/PoliciesList.jsx";
import PoliciesAdd from "@modules/policies/views/PoliciesAdd.jsx";
import PoliciesEdit from "@modules/policies/views/PoliciesEdit.jsx";
import PoliciesDetail from "@modules/policies/views/PoliciesDetail.jsx";
import DmsForm from "@modules/dms/views/DmsForm.jsx";
import DmsList from "@modules/dms/views/DmsList.jsx";

export const DMS_ROUTES = {
    READ:{
        path:'/module/dms/list/',
        permission:'dms.view_dmsjournal'
    },

    ADD:{
        path:'/module/dms/attachments/:id',
        permission:'dms.add_dmsjournal'
}


}

export const MODULE_ROUTES = [
    {
        path:DMS_ROUTES.ADD.path,
        component:DmsForm,
        permission:DMS_ROUTES.ADD.permission
    },
    {
        path:DMS_ROUTES.READ.path,
        component:DmsList,
        permission: DMS_ROUTES.READ.permission
    }
    ]
