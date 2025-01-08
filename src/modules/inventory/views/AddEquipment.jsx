
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InventoryForm from "@modules/inventory/components/InventoryForm.jsx";

const SubscriptionCreate = () => {
    return (
        <>
            <PageHeader currentpage="Add New Equipment" activepage="Equipment" mainpage="Add" />
            <InventoryForm />
        </>
    );
};

export default SubscriptionCreate;
