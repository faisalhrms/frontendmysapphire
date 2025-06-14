import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx";
import { useForm, Controller } from "react-hook-form";

import { FaCamera } from "react-icons/fa";

const ScanBarcdeForm = () => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);

    const handleScanClick = () => {
        if (scanning) {
            scannerRef.current?.stop().then(() => {
                document.getElementById("reader").innerHTML = "";
                setScanning(false);
            });
            return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        setScanning(true);

        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                html5QrCode.stop().then(() => {
                    document.getElementById("reader").innerHTML = "";
                    setValue("scan", decodedText);
                    setScanning(false);
                    console.log("Scanned barcode:", decodedText);
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    };

    const onSubmit = (data) => {
        console.log("Submitted barcode:", data.scan);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-20 text-black flex flex-col items-center">
            <div className="xl:col-span-4 col-span-4">
                <div className="box shadow-lg rounded-lg bg-white p-4">
                    <div className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
                         style={{
                             height: "300px",
                             transition: "all 0.3s",
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                         }}
                    >
                        <div
                            id="reader"

                            style={{
                                width: scanning ? "100%" : "0",
                                height: scanning ? "100%" : "0",
                                transition: "all 0.3s",

                            }}
                        ></div>

                        {!scanning && (
                            <button
                                onClick={handleScanClick}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-white shadow-md border-2 border-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
                                title={scanning ? "Stop Scanning" : "Scan Barcode"}
                                type="button"
                            >
                                <FaCamera className="w-6 h-6"/>
                            </button>
                        )}
                    </div>
                    <div className="p-4 w-full max-w-md mx-auto">
                        <label htmlFor="scan" className="block text-sm font-medium text-gray-700 mb-2">
                            Scan or type barcode
                        </label>
                        <div className="flex items-center">
                            <FormInput
                                is_required={false}
                                name="scan"
                                control={control}
                                errors={errors}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSubmit(onSubmit)();
                                    }
                                }}
                                className="pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out flex-grow mr-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleSubmit(onSubmit)()}
                                className="ti-btn ti-btn-primary  !mb-0 ml-4"
                            >
                                Submit
                            </button>
                        </div>
                    </div>


                </div>
            </div>

        </form>
    );
};

export default ScanBarcdeForm;


// import React, { useRef, useState, useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import FormInput from "@components/form/FormInput.jsx";
// import { useForm, Controller } from "react-hook-form";
// import { FaCamera, FaChevronDown, FaChevronRight, FaRedo, FaTimes, FaBox, FaMapMarkerAlt } from "react-icons/fa";
//
// const ScanBarcodeForm = ({data, isLoading}) => {
//     const {
//         control,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: { errors },
//     } = useForm();
//
//     const scannerRef = useRef(null);
//     const [scanning, setScanning] = useState(false);
//     const [scannedProduct, setScannedProduct] = useState(null);
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [currentBarcode, setCurrentBarcode] = useState("");
//     const [hasSearched, setHasSearched] = useState(false);
//
//     const scannedValue = watch("scan");
//
//     useEffect(() => {
//         if (data && !isLoading && currentBarcode) {
//             setScannedProduct(data);
//             setIsExpanded(true);
//             setHasSearched(true);
//         } else if (data === null && !isLoading && currentBarcode && hasSearched) {
//
//             setScannedProduct(null);
//             alert("Product not found in inventory!");
//         }
//     }, [data, isLoading, currentBarcode, hasSearched]);
//
//     const handleScanClick = () => {
//         if (scanning) {
//             scannerRef.current?.stop().then(() => {
//                 document.getElementById("reader").innerHTML = "";
//                 setScanning(false);
//             });
//             return;
//         }
//
//         const html5QrCode = new Html5Qrcode("reader");
//         scannerRef.current = html5QrCode;
//         setScanning(true);
//
//         html5QrCode.start(
//             { facingMode: "environment" },
//             { fps: 10, qrbox: 250 },
//             (decodedText) => {
//                 html5QrCode.stop().then(() => {
//                     document.getElementById("reader").innerHTML = "";
//                     setValue("scan", decodedText);
//                     setScanning(false);
//                     setCurrentBarcode(decodedText);
//                     setHasSearched(true); // Mark as searched when scanned
//                     console.log("Scanned barcode:", decodedText);
//                 });
//             },
//             (error) => {
//                 console.warn(error);
//             }
//         );
//     };
//
//     const onSubmit = (data) => {
//         console.log("Submitted barcode:", data.scan);
//         setCurrentBarcode(data.scan);
//         setHasSearched(true); // Mark as searched when submitted
//     };
//
//     const handleRescan = () => {
//         setScannedProduct(null);
//         setValue("scan", "");
//         setIsExpanded(false);
//         setCurrentBarcode("");
//         setHasSearched(false);
//     };
//
//     const handleClearSearch = () => {
//         setScannedProduct(null);
//         setValue("scan", "");
//         setIsExpanded(false);
//         setCurrentBarcode("");
//         setHasSearched(false);
//     };
//
//     const totalStock = scannedProduct ?
//         (scannedProduct.currentLocation?.quantity || 0) + (scannedProduct.otherLocations?.reduce((sum, loc) => sum + (loc.quantity || 0), 0) || 0) : 0;
//
//     return (
//         <>
//
//             <form onSubmit={handleSubmit(onSubmit)} className="mt-20 text-black flex flex-col items-center">
//                 <div className="xl:col-span-4 col-span-4">
//                     <div className="box shadow-lg rounded-lg bg-white p-4">
//                         <div className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
//                              style={{
//                                  height: "300px",
//                                  transition: "all 0.3s",
//                                  display: "flex",
//                                  justifyContent: "center",
//                                  alignItems: "center",
//                              }}
//                         >
//                             <div
//                                 id="reader"
//                                 style={{
//                                     width: scanning ? "100%" : "0",
//                                     height: scanning ? "100%" : "0",
//                                     transition: "all 0.3s",
//                                 }}
//                             ></div>
//
//                             {!scanning && (
//                                 <button
//                                     onClick={handleScanClick}
//                                     className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-white shadow-md border-2 border-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
//                                     title={scanning ? "Stop Scanning" : "Scan Barcode"}
//                                     type="button"
//                                 >
//                                     <FaCamera className="w-6 h-6"/>
//                                 </button>
//                             )}
//                         </div>
//
//                              <div className="input-group">
//                             <div className="p-4 w-full max-w-md mx-auto">
//                                 <label htmlFor="scan" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Scan or type barcode
//                                 </label>
//                                 <div className="flex items-center">
//                                     <FormInput
//                                         is_required={false}
//                                         name="scan"
//                                         control={control}
//                                         errors={errors}
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter") {
//                                                 e.preventDefault();
//                                                 handleSubmit(onSubmit)();
//                                             }
//                                         }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => handleSubmit(onSubmit)()}
//                                         className=" bi bi-search h-11 ti-btn ti-btn-primary !mb-0 ml-4 "
//                                         disabled={isLoading}
//                                     >
//                                         {isLoading ? "Loading..." : ""}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         </div>
//
//                     </div>
//             </form>
//
//
//             {isLoading && hasSearched && currentBarcode && (
//
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
//                         <div className="flex items-center justify-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                             <span className="ml-3 text-gray-600">Loading product data...</span>
//                         </div>
//                     </div>
//
//             )}
//
//             {scannedProduct && !isLoading && hasSearched && (
//                 <div className=" border border-gray-500">
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                         <div
//                             className="bg-gradient-to-r bg-[#383853] text-white p-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
//                             onClick={() => setIsExpanded(!isExpanded)}
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center space-x-3">
//                                     {isExpanded ?
//                                         <FaChevronDown className="h-3 w-3"/> :
//                                         <FaChevronRight className="h-3  w-3"/>
//                                     }
//                                     <span className="font-semibold text-lg">
//                                         Current: {scannedProduct.currentLocation?.warehousename || 'Unknown Location'}
//                                     </span>
//                                 </div>
//                                 <div className="bg-white/20 px-3 py-1 rounded-full">
//                                     <span className="text-sm font-medium">
//                                         Qty: {scannedProduct.currentLocation?.onhand_qty || 0}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {isExpanded && (
//                             <div className="p-4 bg-gray-50 border-b">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-3">
//                                         <div className="flex items-center space-x-2">
//                                             <span className="text-sm font-bold text-black w-20">Barcode:</span>
//                                             <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
//                                                 {scannedProduct.barcode || currentBarcode}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <span className="text-sm font-bold text-black w-20">Size:</span>
//                                             <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
//                                                 {scannedProduct.sizes }
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="space-y-3">
//                                         <div className="flex items-center space-x-2">
//                                             <span className="text-sm font-bold text-black w-16">Price:</span>
//                                             <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
//                                                 {scannedProduct.discount_price}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                                 <span className="text-sm font-bold text-black w-16">Disc:</span>
//                                                 <div className="flex items-center space-x-2">
//                                                     <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
//                                                         {scannedProduct.discount_per}
//                                                     </span>
//                                                 </div>
//                                             </div>
//
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {scannedProduct.otherLocations && scannedProduct.otherLocations.length > 0 && (
//                             <div className="p-6">
//                                 <div className="flex items-center space-x-2 mb-4">
//                                     <FaMapMarkerAlt className="h-5 w-5 text-gray-600" />
//                                     <h3 className="font-semibold text-gray-800 text-lg">Other Locations</h3>
//                                     <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
//                                         ({scannedProduct.otherLocations.length})
//                                     </span>
//                                 </div>
//
//                                 <div className="space-y-3">
//                                     {scannedProduct.otherLocations.map((location, index) => {
//                                         const colorClasses = getLocationColorClasses(location.color);
//                                         const dotColor = getLocationDotColor(location.color);
//                                         const [fromColor, toColor, borderColor, bgColor, textColor] = colorClasses.split(' ');
//
//                                         return (
//                                             <div key={index} className={`flex items-center justify-between p-4 bg-gradient-to-r ${fromColor} ${toColor} rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}>
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className={`w-2 h-2 ${dotColor} rounded-full`}></div>
//                                                     <span className="font-medium text-gray-800">{location.warehousename}</span>
//                                                 </div>
//                                                 <div className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-semibold`}>
//                                                     Qty: {location.onhand_qty}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         )}
//
//
//                         <div className="p-6 bg-white border-t">
//                             <div className="flex flex-col sm:flex-row gap-3">
//                                 <button
//                                     onClick={handleRescan}
//                                     className="ti-btn ti-btn-primary !mb-0 flex items-center space-x-2"
//                                     type="button"
//                                 >
//                                     <FaRedo className="h-4 w-4" />
//                                     <span>Re-scan</span>
//                                 </button>
//
//                                 <button
//                                     onClick={handleClearSearch}
//                                     className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem] flex items-center space-x-2"
//                                     type="button"
//                                 >
//                                     <FaTimes className="h-4 w-4" />
//                                     <span>Clear Search</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {hasSearched && !scannedProduct && !isLoading && currentBarcode && (
//                 <div className="max-w-8xl mx-auto p-6 bg-white">
//                     <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
//                         <div className="text-center">
//                             <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                             <h3 className="text-lg font-medium text-gray-200 mb-2">No Product Found</h3>
//                             <p className="text-gray-500 mb-4">
//                                 No product found with barcode: <span className="font-mono font-semibold">{currentBarcode}</span>
//                             </p>
//                             <button
//                                 onClick={handleClearSearch}
//                                 className="ti-btn ti-btn-primary"
//                                 type="button"
//                             >
//                                 Search Again
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };
//
// export default ScanBarcodeForm;