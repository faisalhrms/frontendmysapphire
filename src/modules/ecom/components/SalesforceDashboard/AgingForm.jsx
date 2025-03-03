// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import AgingPendingTable from "./AgingPendingTable.jsx";
// import { fetchPendingOrders, FetchPendingOrderLib } from "../../services/salesforcedashboard_services.js";
// import { formatNumberWithCommas } from "@helpers/formatters.js";
// import Modal from "../../components/SalesforceDashboard/Model.jsx";
// const AgingFormComponent = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [modalData, setModalData] = useState(null);
//     const { data: pendingOrdersData, isLoading: loadingOrders } = useQuery({
//         queryKey: ["pendingOrders", selectedDate],
//         queryFn: () => fetchPendingOrders(selectedDate),
//         staleTime: 60000,
//         refetchOnWindowFocus: false
//     });
//
//     const { data: pendingOrdersLibData, isLoading: loadingOrdersLib } = useQuery({
//         queryKey: ["pendingOrdersLib", selectedDate],
//         queryFn: () => FetchPendingOrderLib(selectedDate),
//         staleTime: 60000,
//         refetchOnWindowFocus: false
//     });
//
//     const handleDateChange = (event) => {
//         setSelectedDate(event.target.value);
//     };
//
//     const handleModalOpen = (row) => {
//         setModalData(row); // Set the data for the modal
//         setIsModalVisible(true);  // Show the modal
//     };
//
//     const tables = [
//         {
//             title: "Pending Orders before assigning Fulfillment Order",
//             headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
//             data: pendingOrdersData?.before_fulfilment?.map(item => ({
//                 reason: item.reason,
//                 days_1_3: formatNumberWithCommas(item.days_1_3),
//                 days_4_5: formatNumberWithCommas(item.days_4_5),
//                 days_6_10: formatNumberWithCommas(item.days_6_10),
//                 days_11_20: formatNumberWithCommas(item.days_11_20),
//                 days_20_plus: formatNumberWithCommas(item.days_20_plus),
//                 total: formatNumberWithCommas(item.total),
//             })) || [],
//             loading: loadingOrders,
//             noteText: "*Above aging from Order landed date till today."
//         },
//
//         {
//             title: "Pending @ Warehouse level",
//             headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
//             data: pendingOrdersData?.warehouse_level?.map(item => ({
//                 reason: item.reason,
//                 days_1_3: formatNumberWithCommas(item.days_1_3),
//                 days_4_5: formatNumberWithCommas(item.days_4_5),
//                 days_6_10: formatNumberWithCommas(item.days_6_10),
//                 days_11_20: formatNumberWithCommas(item.days_11_20),
//                 days_20_plus: formatNumberWithCommas(item.days_20_plus),
//                 total: formatNumberWithCommas(item.total),
//             })) || [],
//             loading: loadingOrders,
//             noteText: "*Unapproved: Age from Order Landed date. Approved: Age from FO Assigned date."
//         },
//         {
//             title: "Pending Liability @ Courier",
//             headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
//             data: pendingOrdersLibData?.liability_level?.map(item => ({
//                 reason: item.reason,
//                 days_1_3: formatNumberWithCommas(item.days_1_3),
//                 days_4_5: formatNumberWithCommas(item.days_4_5),
//                 days_6_10: formatNumberWithCommas(item.days_6_10),
//                 days_11_20: formatNumberWithCommas(item.days_11_20),
//                 days_20_plus: formatNumberWithCommas(item.days_20_plus),
//                 total: formatNumberWithCommas(item.total),
//             })) || [],
//             loading: loadingOrdersLib,
//             noteText: "*Not Picked: Age from Dispatch date in OMS. In-Transit: Age from Parcel Picked Date."
//         },
//         {
//             title: "Return %age Performance",
//             headers: ["Courier Name", "Total Picked", "Returned", "Return %"],
//             data: pendingOrdersData?.courier_level?.map(item => ({
//                 courier_name: item.courier_name,
//                 total_picked: formatNumberWithCommas(item.total_picked),
//                 returned: formatNumberWithCommas(item.returned),
//                 returned_per: formatNumberWithCommas(item.returned_per),
//             })) || [],
//             loading: loadingOrders,
//             totals: [
//                 "Total",
//                 formatNumberWithCommas(pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.total_picked, 0) || 0),
//                 formatNumberWithCommas(pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.returned, 0) || 0),
//                 `${(
//                     ((pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.returned, 0) || 0) /
//                         (pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.total_picked, 0) || 1)) * 100
//                 ).toFixed(2)}%`
//             ],
//             noteText: "*Returned Performance data for each courier."
//         }
//     ];
//
//     return (
//         <div className="grid grid-cols-2 gap-4 mt-4">
//             {tables.map((table, index) => (
//                 <AgingPendingTable
//                     key={index}
//                     title={table.title}
//                     headers={table.headers}
//                     data={table.loading ? [] : table.data}
//                     totals={table.loading ? [] : table.totals}
//                     loading={table.loading}
//                     noteText={table.noteText}
//                     onCellClick={handleModalOpen}
//                 />
//             ))}
//             {isModalVisible && (
//                 <Modal
//                     onClose={() => setIsModalVisible(false)}
//                     modalType="details"
//                     modalData={modalData}
//                     isVisible={isModalVisible}
//                 />
//             )}
//         </div>
//     );
// };
//
// export default AgingFormComponent;
//

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgingPendingTable from "./AgingPendingTable.jsx";
import PendingOrderAging from "../../components/SalesforceDashboard/PendingOrdersAging.jsx";
import { fetchPendingOrders, FetchPendingOrderLib } from "../../services/salesforcedashboard_services.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import Modal from "../../components/SalesforceDashboard/Model.jsx";  // Import the Modal component

const AgingFormComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const { data: pendingOrdersData, isLoading: loadingOrders } = useQuery({
        queryKey: ["pendingOrders", selectedDate],
        queryFn: () => fetchPendingOrders(selectedDate),
        staleTime: 60000,
        refetchOnWindowFocus: false
    });

    const { data: pendingOrdersLibData, isLoading: loadingOrdersLib } = useQuery({
        queryKey: ["pendingOrdersLib", selectedDate],
        queryFn: () => FetchPendingOrderLib(selectedDate),
        staleTime: 60000,
        refetchOnWindowFocus: false
    });

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleModalOpen = (row) => {
        setModalData(row);
        setIsModalVisible(true);
    };
    const handleNumberClick = (data, title) => {
        setModalData(data);
        setModalTitle(title);
        setIsModalVisible(true);
    };

    const tables = [
        {
            title: "Pending Orders before assigning Fulfillment Order",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            data: pendingOrdersData?.before_fulfilment?.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            })) || [],
            loading: loadingOrders,
            noteText: "*Above aging from Order landed date till today."
        },
        {
            title: "Pending @ Warehouse level",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            data: pendingOrdersData?.warehouse_level?.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            })) || [],
            loading: loadingOrders,
            noteText: "*Unapproved: Age from Order Landed date. Approved: Age from FO Assigned date."
        },
        {
            title: "Pending Liability @ Courier",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            data: pendingOrdersLibData?.liability_level?.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            })) || [],
            loading: loadingOrdersLib,
            noteText: "*Not Picked: Age from Dispatch date in OMS. In-Transit: Age from Parcel Picked Date."
        },
        {
            title: "Return %age Performance",
            headers: ["Courier Name", "Total Picked", "Returned", "Return %"],
            data: pendingOrdersData?.courier_level?.map(item => ({
                courier_name: item.courier_name,
                total_picked: formatNumberWithCommas(item.total_picked),
                returned: formatNumberWithCommas(item.returned),
                returned_per: formatNumberWithCommas(item.returned_per),
            })) || [],
            loading: loadingOrders,
            totals: [
                "Total",
                formatNumberWithCommas(pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.total_picked, 0) || 0),
                formatNumberWithCommas(pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.returned, 0) || 0),
                `${(
                    ((pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.returned, 0) || 0) /
                        (pendingOrdersData?.courier_level?.reduce((acc, item) => acc + item.total_picked, 0) || 1)) * 100
                ).toFixed(2)}%`
            ],
            noteText: "*Returned Performance data for each courier."
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {tables.map((table, index) => (
                <AgingPendingTable
                    key={index}
                    title={table.title}
                    headers={table.headers}
                    data={table.loading ? [] : table.data}
                    totals={table.loading ? [] : table.totals}
                    loading={table.loading}
                    noteText={table.noteText}
                    onCellClick={(data) => handleNumberClick(data, table.title)}
                />
            ))}
            {isModalVisible && (
                <Modal
                    onClose={() => setIsModalVisible(false)}
                    modalType="details"
                    modalData={modalData}
                    isVisible={isModalVisible}
                >
                    <PendingOrderAging data={modalData}  title={modalTitle}/>
                </Modal>
            )}
        </div>
    );
};

export default AgingFormComponent;

