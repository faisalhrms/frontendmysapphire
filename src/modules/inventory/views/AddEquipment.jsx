
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InventoryForm from "@modules/inventory/components/EquipmentForm.jsx";

const SubscriptionCreate = () => {
    return (
        <>
            <PageHeader currentpage="Add New Asset" activepage="Asset" mainpage="Add" />
            <InventoryForm />
        </>
    );
};

export default SubscriptionCreate;
