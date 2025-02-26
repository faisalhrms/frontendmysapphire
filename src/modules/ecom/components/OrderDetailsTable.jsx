// import React from 'react';
//
// const OrderDetails = () => {
//     return (
//         <div className="max-w-6xl mx-auto p-4 bg-gray-50">
//             <h1 className="text-xl font-semibold mb-4">Details for Order 'PK-6866502'</h1>
//             <div className="border border-gray-300 mb-4">
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Information:</div>
//                     <div className="p-2">Contains 1 line item to 1 shipping location The total price is Rs6,161.00.</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Date Received:</div>
//                     <div className="p-2">2/20/25 4:11:46 pm Asia/Karachi</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Site:</div>
//                     <div className="p-2">Sapphire</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Created By:</div>
//                     <div className="p-2">Customer</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Customer:</div>
//                     <div className="p-2">Asif Shah (unregistered customer)</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Customer No.:</div>
//                     <div className="p-2">n/a</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">IP Address:</div>
//                     <div className="p-2">192.140.148.155</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Source Code / Group:</div>
//                     <div className="p-2">FacebookAds / metaAds</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Email:</div>
//                     <div className="p-2 text-blue-600 hover:underline">syedamara9@gmail.com</div>
//                 </div>
//
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                     <div className="bg-gray-100 p-2 font-medium">Phone:</div>
//                     <div className="p-2 text-blue-600 hover:underline">03349263124</div>
//                 </div>
//             </div>
//
//
//             <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="border border-gray-300">
//                     <div className="grid grid-cols-2 border-b border-gray-300">
//                         <div className="bg-gray-100 p-2 font-medium">Order Status:</div>
//                         <div className="p-2">Open</div>
//                     </div>
//                 </div>
//
//                 <div className="border border-gray-300">
//                     <div className="grid grid-cols-2 border-b border-gray-300">
//                         <div className="bg-gray-100 p-2 font-medium text-blue-600 hover:underline">Confirmation Status:</div>
//                         <div className="p-2">Confirmed</div>
//                     </div>
//                 </div>
//
//                 <div className="border border-gray-300">
//                     <div className="grid grid-cols-2 border-b border-gray-300">
//                         <div className="bg-gray-100 p-2 font-medium text-blue-600 hover:underline">Shipping Status:</div>
//                         <div className="p-2">Not Shipped</div>
//                     </div>
//                 </div>
//
//                 <div className="border border-gray-300">
//                     <div className="grid grid-cols-2 border-b border-gray-300">
//                         <div className="bg-gray-100 p-2 font-medium text-blue-600 hover:underline">Export Status:</div>
//                         <div className="p-2">Ready for Export</div>
//                     </div>
//                 </div>
//             </div>
//
//
//             <div className="mb-4">
//                 <div className="bg-gray-100 p-2 font-medium text-blue-600 hover:underline border border-gray-300 border-b-0">
//                     Shipment 02800634
//                 </div>
//
//                 <div className="overflow-x-auto">
//                     <table className="w-full border-collapse border border-gray-300">
//                         <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border border-gray-300 p-2 text-left">Qty</th>
//                             <th className="border border-gray-300 p-2 text-left">Product ID</th>
//                             <th className="border border-gray-300 p-2 text-left">Name</th>
//                             <th className="border border-gray-300 p-2 text-left">Manufacturer</th>
//                             <th className="border border-gray-300 p-2 text-left">Tax Rate</th>
//                             <th className="border border-gray-300 p-2 text-left">Unit Sales Price</th>
//                             <th className="border border-gray-300 p-2 text-left">Tax Basis</th>
//                             <th className="border border-gray-300 p-2 text-left">Item Total</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         <tr>
//                             <td className="border border-gray-300 p-2">2</td>
//                             <td className="border border-gray-300 p-2">RI3PEDY2GV26</td>
//                             <td className="border border-gray-300 p-2">3 Piece - Embroidered Lawn Suit</td>
//                             <td className="border border-gray-300 p-2"></td>
//                             <td className="border border-gray-300 p-2">18.00 %</td>
//                             <td className="border border-gray-300 p-2">Rs4,090.00</td>
//                             <td className="border border-gray-300 p-2">Rs6,180.00</td>
//                             <td className="border border-gray-300 p-2">Rs6,180.00</td>
//                         </tr>
//                         </tbody>
//                     </table>
//                 </div>
//
//
//                 <div className="flex justify-end mt-2">
//                     <div className="w-64">
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2">Shipment Shipping Cost</div>
//                             <div className="text-right">Rs0.00</div>
//                         </div>
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2">Total Shipping Cost (F0002):</div>
//                             <div className="text-right">Rs0.00</div>
//                         </div>
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2 text-red-600">Adjustment FBR Service Charges:</div>
//                             <div className="text-right">Rs1.00</div>
//                         </div>
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2">Shipping Total:</div>
//                             <div className="text-right">Rs0.00</div>
//                         </div>
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2 font-bold">Total:</div>
//                             <div className="text-right">Rs6,181.00</div>
//                         </div>
//                         <div className="grid grid-cols-2 mb-1">
//                             <div className="text-right pr-2">Tax Total Included:</div>
//                             <div className="text-right">Rs1,247.00</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//
//             <div className="flex justify-end gap-2">
//                 <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300">Send Email</button>
//                 <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300">Print Order</button>
//             </div>
//         </div>
//     );
// };
//
// export default OrderDetails;