import EquipmentList from '@modules/inventory/views/EquipmentList.jsx';
import AddEquipment from '@modules/inventory/views/AddEquipment.jsx';
import EquipmentDetail from '@modules/inventory/views/EquipmentDetail.jsx';
import EquipmentEdit from '@modules/inventory/views/EquipmentEdit.jsx';
import LaptopList from '@modules/inventory/views/LaptopList.jsx';
import EquipmentReportList from '@modules/inventory/views/EquipmentReportList.jsx';
import EquipmentSiteWiseReport from '@modules/inventory/views/EquipmentSiteWiseReport.jsx';
import ReAssignEquipment from '@modules/inventory/views/ReAssignEquipment.jsx';
import EquipmentHistory from '@modules/inventory/views/EquipmentHistory.jsx';
import Equipment from "@modules/inventory/views/Equipment.jsx";
import LocationSubnetList from "@modules/inventory/views/LocationSubnetList.jsx";
import LocationSubnetAdd from "@modules/inventory/views/LocationSubnetAdd.jsx";
import LocationSubnetEdit from "@modules/inventory/views/LocationSubnetEdit.jsx";
import EquipmentAuditList from "@modules/inventory/views/EquipmentAuditList.jsx";
import ITGovernList from "@modules/it_governance/views/ITGovernList.jsx";
import ITGovernAdd from "@modules/it_governance/views/ITGovernAdd.jsx";
import ITGovernEdit from "@modules/it_governance/views/ITGovernEdit.jsx";
import ApplicationUniverseList from "@modules/it_governance/views/ApplicationUniverseList.jsx";
import ApplicationUniverseAdd from "@modules/it_governance/views/ApplicationUniverseAdd.jsx";
import ApplicationUniverseEdit from "@modules/it_governance/views/ApplicationUniverseEdit.jsx";
import WarrantyList from "@modules/it_governance/views/WarrantyList.jsx";
import WarrantyAdd from "@modules/it_governance/views/WarrantyAdd.jsx";
import WarrantyEdit from "@modules/it_governance/views/WarrantyEdit.jsx";
import ApplicationUniverseDetail from "@modules/it_governance/views/ApplicationUniverseDetail.jsx";

export const IT_GOVERNANCE_ROUTES = {
    READ: {
        path: '/module/it-governance/service-level-agreements',
        permission:"it_governance.view_servicelevelagreement"
    },
    ADD: {
        path: '/module/it-governance/service-level-agreements/add',
        permission:"it_governance.add_servicelevelagreement"
    },
    DETAIL: {
        path: '/module/it-governance/service-level-agreements/detail/:id',
        permission:"user.view_ess_modules"
    },
    EDIT: {
        path: '/module/it-governance/service-level-agreements/edit/:id',
        permission:"it_governance.change_servicelevelagreement"
    },
    APPLICATION_UNIVERSE:{
        READ: {
            path: '/module/it-governance/application-universe',
            permission:"it_governance.view_applicationuniverse"

        },
        ADD: {
            path: '/module/it-governance/application-universe/add',
            permission:"it_governance.add_applicationuniverse"

        },
        DETAIL: {
            path: '/module/it-governance/application-universe/detail/:id',
            permission:"it_governance.view_applicationuniverse"

        },
        EDIT: {
            path: '/module/it-governance/application-universe/edit/:id',
            permission:"it_governance.change_applicationuniverse"

        }
    },
    WARRANTY:{
        READ: {
            path: '/module/it-governance/warranty',
            permission:"it_governance.view_applicationuniverse"

        },
        ADD: {
            path: '/module/it-governance/warranty/add',
            permission:"it_governance.add_applicationuniverse"

        },
        DETAIL: {
            path: '/module/it-governance/warranty/detail/:id',
            permission:"it_governance.view_applicationuniverse"

        },
        EDIT: {
            path: '/module/it-governance/warranty/edit/:id',
            permission:"it_governance.change_applicationuniverse"

        }
    }

};

export const MODULE_ROUTES = [
    {
        path: IT_GOVERNANCE_ROUTES.READ.path,
        component: ITGovernList,
    },
    {
        path:IT_GOVERNANCE_ROUTES.ADD.path,
        component:ITGovernAdd,
    },{
    path:IT_GOVERNANCE_ROUTES.EDIT.path,
        component:ITGovernEdit,
    },
    {
    path:IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.READ.path,
        component:ApplicationUniverseList
    },
    {
        path:IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.ADD.path,
        component:ApplicationUniverseAdd,
    },
    {
        path:IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.EDIT.path,
        component:ApplicationUniverseEdit
    },
    {
        path:IT_GOVERNANCE_ROUTES.WARRANTY.READ.path,
        component:WarrantyList
    },
    {
        path:IT_GOVERNANCE_ROUTES.WARRANTY.ADD.path,
        component:WarrantyAdd
    },
    {
        path:IT_GOVERNANCE_ROUTES.WARRANTY.EDIT.path,
        component:WarrantyEdit
    },
    {
        path:IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.DETAIL.path,
        component:ApplicationUniverseDetail
    }

];
