import CompanyList from '@modules/setup/views/CompanyList.jsx';
import CompanyForm from '@modules/setup/components/CompanyForm.jsx';
import CompanyEdit from '@modules/setup/views/CompanyEdit.jsx';
import SrTypeList from '@modules/setup/views/SrTypeList.jsx';
import SrTypes from '@modules/setup/views/SrTypes.jsx';
import SrTypesEdit from '@modules/setup/views/SrTypesEdit.jsx';
import EmailSetupList from "@modules/setup/views/EmailSetupList.jsx";
import EmailSetupCreate from "@modules/setup/views/EmailSetupCreate.jsx";
import EmailSetupEdit from "@modules/setup/views/EmailSetupEdit.jsx";

export const SETUP_ROUTES = {
    COMPANY: {
        READ: {
            path: '/module/setup',
            permission: 'user.view_company',
        },
        CREATE: {
            path: '/module/setup/add/',
            permission: 'user.add_company',
        },
        EDIT: {
            path: '/module/setup/edit',
            permission: 'user.change_company',
        },
    },
    SR_TYPE: {
        READ: {
            path: '/module/sr',
            permission: 'sr_management.view_srtype',
        },
        CREATE: {
            path: '/module/sr/add/',
            permission: 'sr_management.add_srtype',
        },
        EDIT: {
            path: '/module/sr/edit',
            permission: 'sr_management.change_srtype',
        },
    },
    EMAIL:{
        READ:{
            path:'/module/email-setup/list',
            permission: 'setups.view_emailsetup',
        },
        ADD:{
            path:'/module/email-setup/add',
            permission: 'setups.add_emailsetup',
        },
        EDIT:{
            path:'/module/email-setup/edit/:id',
            permission: 'setups.change_emailsetup',
        }

    }
};

export const MODULE_ROUTES = [
    {
        path: SETUP_ROUTES.COMPANY.READ.path,
        component: CompanyList,
    },
    {
        path: SETUP_ROUTES.COMPANY.CREATE.path,
        component: CompanyForm,
    },
    {
        path: SETUP_ROUTES.COMPANY.EDIT.path,
        component: CompanyEdit,
    },
    {
        path: SETUP_ROUTES.SR_TYPE.READ.path,
        component: SrTypeList,
    },
    {
        path: SETUP_ROUTES.SR_TYPE.CREATE.path,
        component: SrTypes,
    },
    {
        path: SETUP_ROUTES.SR_TYPE.EDIT.path,
        component: SrTypesEdit,
    },
    {
        path:SETUP_ROUTES.EMAIL.READ.path,
        component:EmailSetupList
    },
    {
        path:SETUP_ROUTES.EMAIL.ADD.path,
        component:EmailSetupCreate
    },
    {
        path:SETUP_ROUTES.EMAIL.EDIT.path,
        component:EmailSetupEdit
    }
];
