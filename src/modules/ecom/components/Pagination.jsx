// import React from "react";
//
// const Pagination = ({
//                         pageIndex,
//                         totalPages,
//                         canPreviousPage,
//                         canNextPage,
//                         gotoPage,
//                         previousPage,
//                         nextPage,
//                         pageCount
//                     }) => {
//     const pageRange = 5; // Adjust this value for more or fewer page numbers in the range
//     const startPage = Math.max(1, pageIndex - Math.floor(pageRange / 2));
//     const endPage = Math.min(totalPages, startPage + pageRange - 1);
//
//     return (
//         <div className="flex justify-between items-center mt-4 p-2 border-t border-gray-300 w-full">
//             <span className="text-sm text-gray-600">
//                 Showing {pageIndex * 10 + 1} to {Math.min((pageIndex + 1) * 10, pageCount)} of {pageCount} results
//             </span>
//
//             <div className="flex items-center space-x-2">
//                 <button
//                     onClick={() => gotoPage(0)}
//                     disabled={!canPreviousPage}
//                     className={`px-3 py-1 border rounded ${!canPreviousPage ? "text-gray-400 cursor-not-allowed" : ""}`}
//                 >
//                     {"<<"}
//                 </button>
//                 <button
//                     onClick={() => previousPage()}
//                     disabled={!canPreviousPage}
//                     className={`px-3 py-1 border rounded ${!canPreviousPage ? "text-gray-400 cursor-not-allowed" : ""}`}
//                 >
//                     Prev
//                 </button>
//
//                 {startPage > 1 && (
//                     <>
//                         <button
//                             onClick={() => gotoPage(0)}
//                             className="px-3 py-1 border rounded"
//                         >
//                             1
//                         </button>
//                         {startPage > 2 && (
//                             <button className="px-3 py-1 border rounded" disabled>
//                                 ...
//                             </button>
//                         )}
//                     </>
//                 )}
//
//                 {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
//                     <button
//                         key={i + startPage}
//                         onClick={() => gotoPage(i + startPage - 1)}
//                         className={`px-3 py-1 border rounded transition-all ${pageIndex === i + startPage ? "bg-primary text-white font-semibold" : "bg-gray-200"}`}
//                     >
//                         {i + startPage}
//                     </button>
//                 ))}
//
//                 {endPage < totalPages && (
//                     <>
//                         {endPage < totalPages - 1 && (
//                             <button className="px-3 py-1 border rounded bg-primary" disabled>
//                                 ...
//                             </button>
//                         )}
//                         <button
//                             onClick={() => gotoPage(totalPages - 1)}
//                             className="px-3 py-1 border rounded"
//                         >
//                             {totalPages}
//                         </button>
//                     </>
//                 )}
//
//                 <button
//                     onClick={() => nextPage()}
//                     disabled={!canNextPage}
//                     className={`px-3 py-1 border rounded ${!canNextPage ? "text-gray-400 cursor-not-allowed" : ""}`}
//                 >
//                     Next
//                 </button>
//                 <button
//                     onClick={() => gotoPage(pageCount - 1)}
//                     disabled={!canNextPage}
//                     className={`px-3 py-1 border rounded ${!canNextPage ? "text-gray-400 cursor-not-allowed" : ""}`}
//                 >
//                     {">>"}
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default Pagination;