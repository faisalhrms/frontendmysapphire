// import React from 'react';
//
// const MilestoneDetailModel = ({ isOpen, setIsOpen, title, children }) => {
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//             <div className="relative p-4 rounded-lg shadow-lg w-[1200px] bg-white max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center border-b pb-3">
//                     <h2 className="text-lg  text-sm font-semibold">{title}</h2>
//                     <button
//                         onClick={() => setIsOpen(false)}
//                         className="text-xl font-bold text-gray-600 hover:text-gray-800"
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
// const ModalWithTable = ({ isOpen, setIsOpen }) => {
//     return (
//         <MilestoneDetailModel
//             isOpen={isOpen}
//             setIsOpen={setIsOpen}
//             title="View Task Details"
//         >
//             <div className="flex h-screen bg-gray-100">
//                 <div className="bg-white w-full max-w-5xl mx-auto shadow-lg rounded-md overflow-hidden flex">
//                     {/* Left Panel */}
//                     <div className="w-7/12 p-6 border-r border-gray-200">
//                         <div className="mb-4">
//                             <h1 className="text-2xl font-semibold text-gray-800">E-Com ads - launch by visual</h1>
//                             <div className="flex items-center text-sm text-gray-600 mt-1">
//                                 <span>in</span>
//                                 <span className="mx-1">→</span>
//                                 <span className="text-blue-600">RTW</span>
//                                 <span className="ml-1">Board</span>
//                             </div>
//                         </div>
//
//                         {/* Group */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="w-6 h-6 rounded-full bg-gray-800 mr-2"></div>
//                                     <span>Group</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//                                 <div className="flex items-center">
//                                     <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
//                                     <span>18th Apr</span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Name */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="text-xl">T</span>
//                                     </div>
//                                     <span>Name</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//                                 E-Com ads - launch by visual
//                             </div>
//                         </div>
//
//                         {/* Person */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span
//                                             className="w-5 h-5 inline-block rounded-full border border-gray-400 text-center">👤</span>
//                                     </div>
//                                     <span>Person</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//                                 <div
//                                     className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
//                                     NJ
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Team */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="text-xl">T</span>
//                                     </div>
//                                     <span>Team</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//                                 Visual
//                             </div>
//                         </div>
//
//                         {/* Deadline */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">📅</span>
//                                     </div>
//                                     <span>Deadline</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded flex items-center">
//                                 <div className="w-5 h-5 mr-2">
//                                     <div
//                                         className="w-4 h-4 rounded-full border-2 border-gray-400 bg-white relative">
//                                         <div className="absolute inset-0 bg-gray-400 rounded-l-full w-1/2"></div>
//                                     </div>
//                                 </div>
//                                 <span>Apr 15</span>
//                             </div>
//                         </div>
//
//                         {/* Status */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">≡</span>
//                                     </div>
//                                     <span>Status</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-300 p-3 rounded">
//                                 Pending
//                             </div>
//                         </div>
//
//                         {/* Completion Date */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">📅</span>
//                                     </div>
//                                     <span>Completion Da...</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//
//                             </div>
//                         </div>
//
//                         {/* Status Complet... */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">⚡</span>
//                                     </div>
//                                     <span>Status Complet...</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//
//                             </div>
//                         </div>
//
//                         {/* Timeline Groups */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">⚡</span>
//                                     </div>
//                                     <span>Timeline Groups</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//
//                             </div>
//                         </div>
//
//                         {/* Launch */}
//                         <div className="flex items-center">
//                             <div className="w-32 text-gray-700">
//                                 <div className="flex items-center">
//                                     <div className="mr-2">
//                                         <span className="w-5 h-5 inline-block">📅</span>
//                                     </div>
//                                     <span>Launch</span>
//                                 </div>
//                             </div>
//                             <div className="flex-1 bg-gray-50 p-3 rounded">
//                                 Apr 18
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Right Panel */}
//                     <div className="w-5/12 flex flex-col">
//                         {/* Tabs */}
//                         <div className="border-b border-gray-200">
//                             <div className="flex items-center px-4">
//                                 <div className="px-4 py-3 border-b-2 border-blue-500 font-medium text-blue-600">
//                                     <div className="flex items-center">
//                                         <span className="mr-2">🏠</span>
//                                         <span>Updates</span>
//                                     </div>
//                                 </div>
//                                 <div className="px-4 py-3 text-gray-600">Files</div>
//                                 <div className="px-4 py-3 text-gray-600">Activity Log</div>
//                                 <div className="ml-auto">
//                                     <button className="text-xl">+</button>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Update Section */}
//                         <div className="p-4 border-b border-gray-200 flex">
//                             <button
//                                 className="px-4 py-2 border border-gray-300 rounded flex items-center text-gray-600 mr-2">
//                                 <span className="mr-2">✉️</span>
//                                 <span>Update via email</span>
//                             </button>
//                             <button
//                                 className="px-4 py-2 border border-gray-300 rounded flex items-center text-gray-600">
//                                 <span className="mr-2">💬</span>
//                                 <span>Give feedback</span>
//                             </button>
//                         </div>
//
//                         {/* Input Box */}
//                         <div className="p-4 border-b border-gray-200">
//                             <div className="border border-gray-300 rounded-lg p-3">
//                                 <div className="text-gray-500 mb-2">Write an update and mention others with @</div>
//                                 <div className="flex items-center mt-2">
//                                     <button className="mr-3 text-gray-500">@</button>
//                                     <button className="mr-3 text-gray-500">📎</button>
//                                     <button className="mr-3 text-gray-500">😊</button>
//                                     <button className="text-gray-500">🌈</button>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* No Updates Yet */}
//                         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
//                             <div className="mb-6">
//                                 <div className="flex items-center justify-center">
//                                     <div
//                                         className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
//                                         <div
//                                             className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
//                                             <span>📷</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <h2 className="text-xl font-semibold text-gray-800 mb-2">No updates yet</h2>
//                             <p className="text-gray-600">
//                                 Share progress, mention a teammate, <br/>
//                                 or upload a file to get things moving
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </MilestoneDetailModel>
//     );
// };
//
// export default ModalWithTable;
//
//
//
//
import React from 'react';

const MilestoneDetailModel = ({ isOpen, setIsOpen, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative p-4 rounded-lg shadow-lg w-[1200px] bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className=" text-sm font-semibold">{title}</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-xl font-bold text-gray-600 hover:text-gray-800"
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-col h-screen bg-gray-100">
                    <div className="bg-white shadow-sm w-full mx-auto flex flex-col">{children}</div>
                </div>
            </div>
            </div>
            );
            };

            export default MilestoneDetailModel;



