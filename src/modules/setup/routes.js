import CompanyList from '@modules/setup/views/CompanyList.jsx';
import CompanyForm from '@modules/setup/components/CompanyForm.jsx';
import CompanyEdit from '@modules/setup/views/CompanyEdit.jsx';
import SrTypeList from '@modules/setup/views/SrTypeList.jsx';
import SrTypes from '@modules/setup/views/SrTypes.jsx';
import SrTypesEdit from '@modules/setup/views/SrTypesEdit.jsx';

export const SETUP_ROUTES = {
    COMPANY: {
        READ: {
            path: '/module/setup',
            permission: 'view_company',
        },
        CREATE: {
            path: '/module/setup/add/',
            permission: 'add_company',
        },
        EDIT: {
            path: '/module/setup/edit',
            permission: 'change_company',
        },
    },
    SR_TYPE: {
        READ: {
            path: '/module/sr',
            permission: 'view_srtype',
        },
        CREATE: {
            path: '/module/sr/add/',
            permission: 'create_srtype',
        },
        EDIT: {
            path: '/module/sr/edit',
            permission: 'change_srtype',
        },
    },
    READ: undefined,
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
];
