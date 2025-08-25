import { Fragment } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentSummary from "@modules/inventory/components/EquipmentSummary.jsx";
import EquipmentAdditionalDetail from "@modules/inventory/components/EquipmentAdditionalDetail.jsx";
import SubEquipmentDetail from "@modules/inventory/components/SubEquipmentDetail.jsx";
import EquipmentAttachment from "@modules/inventory/views/EquipmentAttachment.jsx";
import RepairsList from "@modules/inventory/components/RepairsList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useEquipment } from "@modules/inventory/hooks/inventoryHooks.js";
import EquipmentOtherDetails from "@modules/inventory/components/EquipmentOtherDetails.jsx";
import VerificationList from "@modules/inventory/components/VerificationList.jsx";

const EquipmentDetail = () => {
    const { id } = useParams();
    const { equipmentData } = useEquipment(id);

    if (!equipmentData) {
        return <LoadingSpinner />;
    }

    return (
        <Fragment>
            <PageHeader
                currentpage="Asset Details"
                title="Asset Details"
                activepage="Asset"
                mainpage="Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 space-y-6">
                    <EquipmentSummary equipmentData={equipmentData} />
                    <RepairsList repairs={equipmentData.repairs} />
                    <VerificationList verifications={equipmentData.verifications} />
                    <SubEquipmentDetail equipmentData={equipmentData} />

                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 mb-5 space-y-6">
                    <EquipmentAdditionalDetail equipmentData={equipmentData} />
                    <EquipmentOtherDetails equipmentData={equipmentData} />
                    <EquipmentAttachment attachments={equipmentData.attachments} />
                </div>
            </div>
        </Fragment>
    );
};

export default EquipmentDetail;
