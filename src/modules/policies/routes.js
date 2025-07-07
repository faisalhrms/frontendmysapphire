import PoliciesList from "@modules/policies/views/PoliciesList.jsx";
import PoliciesAdd from "@modules/policies/views/PoliciesAdd.jsx";
import PoliciesEdit from "@modules/policies/views/PoliciesEdit.jsx";
import PoliciesDetail from "@modules/policies/views/PoliciesDetail.jsx";

export const POLICIES_ROUTES = {
    READ:{
        path:'/policies/list',
        permission:'policies.view_policy'
    },
    ADD:{
        path:'/policies/add',
        permission:'policies.add_policy'
    },
    EDIT:{
        path:'/policies/edit/:id',
        permission:'policies.change_policy'
    }

}

export const MODULE_ROUTES = [
    {
        path:POLICIES_ROUTES.READ.path,
        component:PoliciesList
    },
    {
        path:POLICIES_ROUTES.ADD.path,
        component:PoliciesAdd
    },
    {
        path:POLICIES_ROUTES.EDIT.path,
        component:PoliciesEdit
    }
    ]
