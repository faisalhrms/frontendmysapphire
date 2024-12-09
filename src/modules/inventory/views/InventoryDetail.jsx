import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {useParams} from "react-router-dom";
import {useEquipment} from "@modules/inventory/hooks/inventoryHooks.js";
import EquipmentSummary from "@modules/inventory/views/EquipmentSummary.jsx";
import EquipmentAdditionalDetail from "@modules/inventory/views/EquipmentAdditionalDetail.jsx";
import DataTable from "@components/DataTable.jsx";
const dummyEquipment = {
    id: 1,
    name: "Excavator 3000",
    equipment_no: 'EQ12345',
    type: 'Heavy Machinery',
    status: 'active',
    priority: 'high',
    tags: [
        {id: 1, name: 'urgent'},
        {id: 2, name: 'safety-critical'}
    ],
    description: "A high-performance excavator used for large-scale construction projects.",
    castodian: {
        full_name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    started_at: "2024-01-01T09:00:00Z",
    ended_at: "2024-02-01T18:00:00Z",
};

const inventoryDetail=()=>{
    const { id } = useParams();
const {equipmentData}=useEquipment(id);
    return(
        <>
            <PageHeader currentpage={`Equipment Detail`} activepage="Equipments" mainpage={equipmentData ? equipmentData.equipment_no : 'EQU - 00000000'}/>

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12">

                    <EquipmentSummary equipment={dummyEquipment}/>
                    <DataTable
                        columns={[]}
                        title="Equipments History"
                        apiUrl=""
                    />

                </div>
                <div className="xl:col-span-3 col-span-12">
                    <EquipmentAdditionalDetail equipment={dummyEquipment}/>
                </div>
            </div>


        </>
    )
}
export default inventoryDetail