import RoadMapSetup from "@modules/road-map/setup/views/RoadMapSetup.jsx";
import UnitCategoryForm from "@modules/road-map/setup/unit-category/components/UnitCategoryForm.jsx";
import UnitForm from "@modules/road-map/setup/unit/components/UnitForm.jsx";
import ProcessMethodForm from "@modules/road-map/setup/process-method/components/ProcessMethodForm.jsx";
import DyesMethodForm from "@modules/road-map/setup/dyes-method/components/DyesMethodForm.jsx";
import StitchTypeForm from "@modules/road-map/setup/stitch-type/components/StitchTypeForm.jsx";
import SupplierForm from "@modules/road-map/setup/suppliers/components/SupplierForm.jsx";
import CertificateForm from "@modules/road-map/setup/certificates/components/CertificateForm.jsx";
import ProductForm from "@modules/road-map/setup/products/components/ProductForm.jsx";
import QualityForm from "@modules/road-map/setup/quality/components/QualityForm.jsx";
import ChainList from "@modules/road-map/Chain-Designer/views/ChainList.jsx";
import ChainForm from "@modules/road-map/Chain-Designer/components/ChainForm.jsx";


export const ROADMAP_SETUP = {
    READ: {
        path: '/module/roadmap/setup',
        permission: 'auth.view_roadmap_setup',
    },
};

export const UNIT_CATEGORY = {
    CREATE: {
        path: '/module/roadmap/unit/category/add',
        permission: 'roadmap.add_unit_category',
    },
    READ: {
        path: '/module/roadmap/unit/category',
        permission: 'roadmap.view_unit_category',
    },
};

export const UNIT = {
    CREATE: {
        path: '/module/roadmap/unit/add',
        permission: 'roadmap.add_unit',
    },
    READ: {
        path: '/module/roadmap/unit',
        permission: 'roadmap.view_unit',
    },
};

export const PROCESS_METHOD = {
    CREATE: {
        path: '/module/roadmap/process/method/add',
        permission: 'roadmap.add_process_method',
    },
    READ: {
        path: '/module/roadmap/process/method',
        permission: 'roadmap.view_process_method',
    },
};

export const DYES_METHOD = {
    CREATE: {
        path: '/module/roadmap/dyes/method/add',
        permission: 'roadmap.add_dyes_method',
    },
    READ: {
        path: '/module/roadmap/dyes/method',
        permission: 'roadmap.view_dyes_method',
    },
};

export const STITCH_TYPE = {
    CREATE: {
        path: '/module/roadmap/stitch/type/add',
        permission: 'roadmap.add_stitch_type',
    },
    READ: {
        path: '/module/roadmap/stitch/type',
        permission: 'roadmap.view_stitch_type',
    },
};

export const Supplier = {
    CREATE: {
        path: '/module/roadmap/supplier/add',
        permission: 'roadmap.add_supplier',
    },
    READ: {
        path: '/module/roadmap/supplier',
        permission: 'roadmap.view_supplier',
    },
};

export const Certificate = {
    CREATE: {
        path: '/module/roadmap/certificate/add',
        permission: 'roadmap.add_certificate',
    },
    READ: {
        path: '/module/roadmap/certificate',
        permission: 'roadmap.view_certificate',
    },
};

export const ROADMAP_Product = {
    CREATE: {
        path: '/module/roadmap/product/add',
        permission: 'roadmap.add_roadmap_products',
    },
    READ: {
        path: '/module/roadmap/product',
        permission: 'roadmap.view_roadmap_products',
    },
};

export const ROADMAP_Quality = {
    CREATE: {
        path: '/module/roadmap/quality/add',
        permission: 'roadmap.add_qualities',
    },
    READ: {
        path: '/module/roadmap/quality',
        permission: 'roadmap.view_qualities',
    },
};


export const CHAIN_DESIGNER = {
    READ: {
        path: '/module/roadmap/chain',
        permission: 'auth.view_roadmap_setup',
    },
    CREATE: {
        path: '/module/roadmap/chain/add',
        permission: 'auth.view_roadmap_setup',
    },
};

export const MODULE_ROUTES = [
    {
        path: ROADMAP_SETUP.READ.path,
        component: RoadMapSetup,
        permission: ROADMAP_SETUP.READ.permission,
    },
    {
        path: UNIT_CATEGORY.CREATE.path,
        component: UnitCategoryForm,
        permission: UNIT_CATEGORY.CREATE.permission,
    },
    {
        path: UNIT.CREATE.path,
        component: UnitForm,
        permission: UNIT.CREATE.permission,
    },
    {
        path: PROCESS_METHOD.CREATE.path,
        component: ProcessMethodForm,
        permission: PROCESS_METHOD.CREATE.permission,
    },
    {
        path: DYES_METHOD.CREATE.path,
        component: DyesMethodForm,
        permission: DYES_METHOD.CREATE.permission,
    },
    {
        path: STITCH_TYPE.CREATE.path,
        component: StitchTypeForm,
        permission: STITCH_TYPE.CREATE.permission,
    },
    {
        path: Supplier.CREATE.path,
        component: SupplierForm,
        permission: Supplier.CREATE.permission,
    },
    {
        path: Certificate.CREATE.path,
        component: CertificateForm,
        permission: Certificate.CREATE.permission,
    },
    {
        path: ROADMAP_Product.CREATE.path,
        component: ProductForm,
        permission: ROADMAP_Product.CREATE.permission,
    },
    {
        path: ROADMAP_Quality.CREATE.path,
        component: QualityForm,
        permission: ROADMAP_Quality.CREATE.permission,
    },
    {
        path: CHAIN_DESIGNER.READ.path,
        component: ChainList,
        permission: CHAIN_DESIGNER.READ.permission,
    },
    {
        path: CHAIN_DESIGNER.CREATE.path,
        component: ChainForm,
        permission: CHAIN_DESIGNER.CREATE.permission,
    },
];
