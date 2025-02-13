// import React, { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
// import OrderBookingShopify from "../components/OrderBookingShopify.jsx";
// import OperationsAgingPerformance from "@modules/ecom/components/OperationsAgingPerformance.jsx";
// import {internationalData, localData , columns} from "@modules/ecom/components/utils.js";
// import PerformanceRatios from "@modules/ecom/components/PerformanceRatios.jsx";
// import MegaSaleForm from "@modules/ecom/components/MegaSaleForm.jsx";
// const OrderShopify = () => {
//     const [activeTab, setActiveTab] = useState("orderBooking");
//     const [showFilters, setShowFilters] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//     const [filteredLocalData, setFilteredLocalData] = useState([]);
//     const [filteredInternationalData, setFilteredInternationalData] = useState([]);
//     const [filteredLocalFiscalData, setFilteredLocalFiscalData] = useState([]);
//     const [filteredInternationalFiscalData, setFilteredInternationalFiscalData] = useState([]);
//
//     const [filteredLocalDataPerform, setFilteredLocalDataPerform] = useState([]);
//     const [filteredInternationalDataPerform, setFilteredInternationalDataPerform] = useState([]);
//
//     const headers = [
//         { label: 'Period', key: 'period' },
//         { label: 'Orders', key: 'cy.orders' },
//         { label: 'Qty', key: 'cy.qty' },
//         { label: 'Value', key: 'cy.value' },
//         { label: 'Orders', key: 'ly.orders' },
//         { label: 'Qty', key: 'ly.qty' },
//         { label: 'Value', key: 'ly.value' },
//         { label: 'Orders', key: 'yoy.orders' },
//         { label: 'Qty', key: 'yoy.qty' },
//         { label: 'Value', key: 'yoy.value' },
//     ];
//
//     const allLocalData = [
//         { period: '2025-01-29', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
//         { period: '2025-01-28', cy: { orders: 13218, qty: 26781, value: 89008866 }, ly: { orders: 10283, qty: 24273, value: 62311449 }, yoy: { orders: 28.5, qty: 10.3, value: 43 } },
//     ];
//
//     const allInternationalData = [
//         { period: '2025-01-29', cy: { orders: 35, qty: 429, value: 2381092 }, ly: { orders: 11, qty: 102, value: 360240 }, yoy: { orders: 218.2, qty: 320.6, value: 561 } },
//         { period: '2025-01-28', cy: { orders: 136, qty: 1306, value: 5919223 }, ly: { orders: 83, qty: 727, value: 2766785 }, yoy: { orders: 63.9, qty: 79.6, value: 114 } },
//     ];
//
//     const allLocalFiscalData = [
//         { period: '2025-01-29', cy: { orders: 1470, qty: 3605, value: 8759237 }, ly: { orders: 1305, qty: 2905, value: 7923618 }, yoy: { orders: 12.5, qty: 24.5, value: 35 } },
//         { period: '2025-01-28', cy: { orders: 13218, qty: 26781, value: 89008866 }, ly: { orders: 10283, qty: 24273, value: 62311449 }, yoy: { orders: 28.5, qty: 10.3, value: 43 } },
//     ];
//
//     const allInternationalFiscalData = [
//         { period: '2025-01-29', cy: { orders: 35, qty: 429, value: 2381092 }, ly: { orders: 15, qty: 220, value: 784440 }, yoy: { orders: 133.3, qty: 95.0, value: 203.5 } },
//         { period: '2025-01-28', cy: { orders: 136, qty: 1306, value: 5919223 }, ly: { orders: 134, qty: 1205, value: 4470418 }, yoy: { orders: 1.5, qty: 8.4, value: 32.4 } },
//     ];
//
//     useEffect(() => {
//         setFilteredLocalData(allLocalData.filter((data) => data.period === selectedDate));
//         setFilteredInternationalData(allInternationalData.filter((data) => data.period === selectedDate));
//         setFilteredLocalFiscalData(allLocalFiscalData.filter((data) => data.period === selectedDate));
//         setFilteredInternationalFiscalData(allInternationalFiscalData.filter((data) => data.period === selectedDate));
//
//         const currentDate = new Date();
//         const formattedDate = currentDate.toISOString().split('T')[0];
//         if(selectedDate==formattedDate){
//             setFilteredLocalDataPerform(localData)
//             setFilteredInternationalDataPerform(internationalData)
//         }else{
//             setFilteredLocalDataPerform([])
//             setFilteredInternationalDataPerform([])
//         }
//
//     }, [selectedDate]);
//
//     return (
//         <>
//             <PageHeader currentpage="E-Commerce" />
//
//             <div className="grid grid-cols-12 gap-6">
//                 <div className="xl:col-span-12 col-span-12">
//
//
//                     <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md">
//                         <nav className="flex space-x-4">
//                             <Link
//                                 to="#"
//                                 className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
//                                     activeTab === "orderBooking"
//                                         ? "bg-primary text-white shadow-md"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                                 onClick={() => setActiveTab("orderBooking")}
//                             >
//                                 Order Booking
//                             </Link>
//                             <Link
//                                 to="#"
//                                 className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
//                                     activeTab === "agingPerformance"
//                                         ? "bg-primary text-white shadow-md"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                                 onClick={() => setActiveTab("agingPerformance")}
//                             >
//                                 Operations Aging Performance
//                             </Link>
//                             <Link
//                                 to="#"
//                                 className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
//                                     activeTab === "Performance Ratios"
//                                         ? "bg-primary text-white shadow-md"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                                 onClick={() => setActiveTab("Performance Ratios")}
//                             >
//                                 Performance Ratios
//                             </Link>
//                             <Link
//                                 to="#"
//                                 className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
//                                     activeTab === "megaSaleForm"
//                                         ? "bg-primary text-white shadow-md"
//                                         : "bg-gray-100 hover:bg-gray-200"
//                                 }`}
//                                 onClick={() => setActiveTab("megaSaleForm")}
//                             >
//                                 Mega Sale
//                             </Link>
//                         </nav>
//
//
//                         <button
//                             type="button"
//                             className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
//                             onClick={() => {
//                                 setShowFilters(!showFilters);
//                                 setSelectedDate(new Date().toISOString().split('T')[0]);
//                             }}
//                         >
//                             <i className="ri-filter-3-fill inline-block"></i> Filters
//                         </button>
//                     </div>
//
//                     {showFilters && (
//                         <div className="bg-white p-4 mt-2 rounded-lg shadow-md">
//                             <div className="mt-4 flex justify-between">
//
//
//                                 <input
//                                     type="date"
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="border p-2 rounded"
//                                 />
//
//
//                                 <button
//                                     className="border px-4 py-2 rounded text-blue-500"
//                                     onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
//                                 >
//                                     <i className="ri-refresh-line"></i> Clear Filters
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//
//
//                     <div className="bg-white mt-4 rounded-lg">
//                         {activeTab === "orderBooking" && (
//                             <div className="mb-8">
//                                 <OrderBookingShopify
//                                     localConfig={{ headers, data: filteredLocalData }}
//                                     internationalConfig={{ headers, data: filteredInternationalData }}
//                                     localConfigFiscal={{ headers, data: filteredLocalFiscalData }}
//                                     internationalConfigFiscal={{ headers, data: filteredInternationalFiscalData }}
//                                 />
//                             </div>
//                         )}
//                         {activeTab === "agingPerformance" && (
//                             <div className="mt-10">
//
//                                 <OperationsAgingPerformance
//                                     localTitle="Local"
//                                     internationalTitle="International"
//                                     columns={columns}
//                                     localData={filteredLocalDataPerform}
//                                     internationalData={filteredInternationalDataPerform}
//                                 />
//                             </div>
//                       )}
//                         {activeTab === "Performance Ratios" && (
//                             <div className="mt-10">
//
//                                 <PerformanceRatios
//
//                                 />
//                             </div>
//                         )}
//                         {activeTab === "megaSaleForm" && (
//                             <div className="mt-10">
//
//                                 <MegaSaleForm
//
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default OrderShopify;
//
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import OrderBookingShopify from "../components/OrderBookingShopify.jsx";
import OperationsAgingPerformance from "@modules/ecom/components/OperationsAgingPerformance.jsx";
import {
  internationalData,
  localData,
  columns,
} from "@modules/ecom/components/utils.js";
import PerformanceRatios from "@modules/ecom/components/PerformanceRatios.jsx";
import MegaSaleForm from "@modules/ecom/components/MegaSaleForm.jsx";
import { createFyobInt, localfyobInt } from "../services/ecom_services.js";

const OrderShopify = () => {
  const [activeTab, setActiveTab] = useState("orderBooking");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filteredLocalFiscalData, setFilteredLocalFiscalData] = useState([]);
  const [filteredLocalDataPerform, setFilteredLocalDataPerform] = useState([]);
  const [
    filteredInternationalDataPerform,
    setFilteredInternationalDataPerform,
  ] = useState([]);

  const headers = [
    { label: "Period", accessor: "period" },
    { label: "Orders", accessor: "cy_order" },
    { label: "Qty", accessor: "cy_qty" },
    { label: "Value", accessor: "cy_value" },
    { label: "Orders", accessor: "ly_order" },
    { label: "Qty", accessor: "ly_qty" },
    { label: "Value", accessor: "ly_value" },
    { label: "Orders", accessor: "yoy_order" },
    { label: "Qty", accessor: "yoy_qty" },
    { label: "Value", accessor: "yoy_value" },
  ];

  const [load, setLoad] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const fyobData = { fiscalYear: 2025, period: selectedDate }; 
      try {
        setLoad(true);
        const response = await localfyobInt(fyobData);
        if (response) {

          setFilteredLocalFiscalData(response?.data);
        } else {
          setFilteredLocalFiscalData([
            {
              period: "string",
              cy_order: 40,
              cy_qty: 0,
              cy_value: 0,
              ly_order: 0,
              ly_qty: 0,
              ly_value: 0,
              yoy_order: 0,
              yoy_qty: 0,
              yoy_value: 0,
            },
          ]);
        }


        const response2 = await createFyobInt(fyobData); 
        if (response2) {
          setFilteredInternationalDataPerform(response2?.data); 
        } else {
            setFilteredInternationalDataPerform([
            {
              period: "string",
              cy_order: 40,
              cy_qty: 0,
              cy_value: 0,
              ly_order: 0,
              ly_qty: 0,
              ly_value: 0,
              yoy_order: 0,
              yoy_qty: 0,
              yoy_value: 0,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching FYOB data", error);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, [selectedDate]);



  let filteredInternationalFiscalData;
  return (
    <>
      <PageHeader currentpage="E-Commerce" />

      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md">
            <nav className="flex space-x-4">
              <Link
                to="#"
                className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
                  activeTab === "orderBooking"
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("orderBooking")}
              >
                Order Booking
              </Link>
              <Link
                to="#"
                className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
                  activeTab === "agingPerformance"
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("agingPerformance")}
              >
                Operations Aging Performance
              </Link>
              <Link
                to="#"
                className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${
                  activeTab === "Performance Ratios"
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Performance Ratios")}
              >
                Performance Ratios
              </Link>
              {/*<Link*/}
              {/*    to="#"*/}
              {/*    className={`px-4 py-3 text-[0.9rem] font-medium rounded-md transition-all ${*/}
              {/*        activeTab === "megaSaleForm"*/}
              {/*            ? "bg-primary text-white shadow-md"*/}
              {/*            : "bg-gray-100 hover:bg-gray-200"*/}
              {/*    }`}*/}
              {/*    onClick={() => setActiveTab("megaSaleForm")}*/}
              {/*>*/}
              {/*    Mega Sale*/}
              {/*</Link>*/}
            </nav>

            <button
              type="button"
              className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
              onClick={() => {
                setShowFilters(!showFilters);
                setSelectedDate(new Date().toISOString().split("T")[0]);
              }}
            >
              <i className="ri-filter-3-fill inline-block"></i> Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 mt-2 rounded-lg shadow-md">
              <div className="mt-4 flex justify-between">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border p-2 rounded"
                />
                <button
                  className="border px-4 py-2 rounded text-blue-500"
                  onClick={() =>
                    setSelectedDate(new Date().toISOString().split("T")[0])
                  }
                >
                  <i className="ri-refresh-line"></i> Clear Filters
                </button>
              </div>
            </div>
          )}

          <div className="bg-white mt-4 rounded-lg">
            {activeTab === "orderBooking" && (
              <div className="mb-8">
                <OrderBookingShopify
                  localConfigFiscal={{ headers, data: filteredLocalFiscalData }}
                  internationalConfigFiscal={{
                    headers,
                    data: filteredInternationalDataPerform,
                  }}
                  load={load}
                />
              </div>
            )}
            {activeTab === "agingPerformance" && (
              <div className="mt-10">
                <OperationsAgingPerformance
                  localTitle="Local"
                  internationalTitle="International"
                  columns={columns}
                  localData={filteredLocalDataPerform}
                  internationalData={filteredInternationalDataPerform}
                />
              </div>
            )}
            {activeTab === "Performance Ratios" && (
              <div className="mt-10">
                <PerformanceRatios />
              </div>
            )}
            {/*{activeTab === "megaSaleForm" && (*/}
            {/*    <div className="mt-10">*/}
            {/*        <MegaSaleForm />*/}
            {/*    </div>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderShopify;
