// import React, { useState } from "react";
//
// const ModalOrderDetail = ({ isOpen, setIsOpen, title, children }) => {
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">{title}</h2>
//                     <button
//                         onClick={() => setIsOpen(false)}
//                         className="text-lg font-bold text-gray-500 hover:text-gray-700"
//                     >
//                         X
//                     </button>
//                 </div>
//                 <div>{children}</div>
//             </div>
//         </div>
//     );
// };
//
//
//
//
// export default ModalOrderDetail;
//
