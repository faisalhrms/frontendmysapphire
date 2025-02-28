
import { Fragment } from "react";
import {  useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentHistory from '@modules/inventory/components/EquipmentHistory.jsx'
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useEquipment} from "@modules/inventory/hooks/inventoryHooks.js";
import EquipmentSummary from "@modules/inventory/components/EquipmentSummary.jsx";
import EquipmentAdditionalDetail from "@modules/inventory/components/EquipmentAdditionalDetail.jsx";
import SubEquipmentDetail from "@modules/inventory/components/SubEquipmentDetail.jsx"
import EquipmentAttachment from "@modules/inventory/views/EquipmentAttachment.jsx";
const EquipmentDetail = () => {
    const { id } = useParams();
    const { equipmentData } = useEquipment(id);

    if (!equipmentData) {
        return <LoadingSpinner/>;
    }

    const {
        type,
        reminder_days,
        payment_cycle,
        status,
        departments,
        attachments,
    } = equipmentData;

    return (
        <Fragment>
            <PageHeader
                currentpage="Equipment Details"
                title="Equipment Details"
                activepage="Equipment"
                mainpage="Details"
            />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12">
                    <EquipmentSummary id={id} equipmentData={equipmentData}/>
                    {/*<EquipmentHistory id={equipmentData.id}/>*/}
                    <SubEquipmentDetail equipmentData={equipmentData}/>

                </div>

                <div className="xl:col-span-3 col-span-12">
                    <EquipmentAdditionalDetail
                        equipmentData={equipmentData}
                    />
                    <EquipmentAttachment attachments={equipmentData.attachments} />
                    {/*<SubscriptionDepartments departments={departments} />*/}
                    {/*{equipmentData.attachments.length >0&&(<SubscriptionAttachment attachments={equipmentData.attachments} />)}*/}
                </div>
            </div>
        </Fragment>
    );
};

export default EquipmentDetail;
