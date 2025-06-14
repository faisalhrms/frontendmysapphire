// import React, { useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import FormInput from "@components/form/FormInput.jsx";
// import { useForm, Controller } from "react-hook-form";
//
// import { FaCamera } from "react-icons/fa";
//
// const ScanBarcdeForm = () => {
//     const {
//         control,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//     } = useForm();
//
//     const scannerRef = useRef(null);
//     const [scanning, setScanning] = useState(false);
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
//     };
//
//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="mt-20 text-black flex flex-col items-center">
//             <div className="xl:col-span-4 col-span-4">
//                 <div className="box shadow-lg rounded-lg bg-white p-4">
//                     <div className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
//                          style={{
//                              height: "300px",
//                              transition: "all 0.3s",
//                              display: "flex",
//                              justifyContent: "center",
//                              alignItems: "center",
//                          }}
//                     >
//                         <div
//                             id="reader"
//
//                             style={{
//                                 width: scanning ? "100%" : "0",
//                                 height: scanning ? "100%" : "0",
//                                 transition: "all 0.3s",
//
//                             }}
//                         ></div>
//
//                         {!scanning && (
//                             <button
//                                 onClick={handleScanClick}
//                                 className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-white shadow-md border-2 border-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
//                                 title={scanning ? "Stop Scanning" : "Scan Barcode"}
//                                 type="button"
//                             >
//                                 <FaCamera className="w-6 h-6"/>
//                             </button>
//                         )}
//                     </div>
//                     <div className="p-4 w-full max-w-md mx-auto">
//                         <label htmlFor="scan" className="block text-sm font-medium text-gray-700 mb-2">
//                             Scan or type barcode
//                         </label>
//                         <div className="flex items-center">
//                             <FormInput
//                                 is_required={false}
//                                 name="scan"
//                                 control={control}
//                                 errors={errors}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         e.preventDefault();
//                                         handleSubmit(onSubmit)();
//                                     }
//                                 }}
//                                 className="pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out flex-grow mr-4"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => handleSubmit(onSubmit)()}
//                                 className="ti-btn ti-btn-primary  !mb-0 ml-4"
//                             >
//                                 Submit
//                             </button>
//                         </div>
//                     </div>
//
//
//                 </div>
//             </div>
//
//         </form>
//     );
// };
//
// export default ScanBarcdeForm;
import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx";
import { useForm, Controller } from "react-hook-form";
import { FaCamera, FaChevronDown, FaChevronRight, FaRedo, FaTimes, FaBox, FaMapMarkerAlt } from "react-icons/fa";

const ScanBarcodeForm = () => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [scannedProduct, setScannedProduct] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Mock product data - replace with actual API call
    const mockProductData = {
        "000000BML002": {
            barcode: "000000BML002",
            size: "M",
            price: "1,490 PKR",
            discountPrice: "969 PKR",
            discount: "35% OFF",
            currentLocation: {
                name: "Karachi Main Warehouse",
                quantity: 51
            },
            otherLocations: [
                { name: "Karachi South", quantity: 20, color: "green" },
                { name: "Lahore Depot", quantity: 38, color: "blue" },
                { name: "Islamabad Hub", quantity: 10, color: "purple" }
            ]
        }
    };

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

                    // Check if product exists in mock data
                    const productData = mockProductData[decodedText];
                    if (productData) {
                        setScannedProduct(productData);
                        setIsExpanded(true);
                    } else {
                        // Handle product not found
                        setScannedProduct(null);
                        alert("Product not found in inventory!");
                    }

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

        // Check if manually entered barcode exists
        const productData = mockProductData[data.scan];
        if (productData) {
            setScannedProduct(productData);
            setIsExpanded(true);
        } else {
            setScannedProduct(null);
            alert("Product not found in inventory!");
        }
    };

    const handleRescan = () => {
        setScannedProduct(null);
        setValue("scan", "");
        setIsExpanded(false);
    };

    const handleClearSearch = () => {
        setScannedProduct(null);
        setValue("scan", "");
        setIsExpanded(false);
    };

    const getLocationColorClasses = (color) => {
        const colorMap = {
            green: "from-green-50 to-green-100 border-green-200 bg-green-200 text-green-800",
            blue: "from-blue-50 to-blue-100 border-blue-200 bg-blue-200 text-blue-800",
            purple: "from-purple-50 to-purple-100 border-purple-200 bg-purple-200 text-purple-800"
        };
        return colorMap[color] || colorMap.green;
    };

    const getLocationDotColor = (color) => {
        const colorMap = {
            green: "bg-green-500",
            blue: "bg-blue-500",
            purple: "bg-purple-500"
        };
        return colorMap[color] || colorMap.green;
    };

    const totalStock = scannedProduct ?
        scannedProduct.currentLocation.quantity + scannedProduct.otherLocations.reduce((sum, loc) => sum + loc.quantity, 0) : 0;

    return (
        <>
            {/* Original Scanner Form - Unchanged */}
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


            {scannedProduct && (
                <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                        <div
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {isExpanded ?
                                        <FaChevronDown className="h-5 w-5"/> :
                                        <FaChevronRight className="h-5 w-5"/>
                                    }
                                    <FaBox className="h-5 w-5"/>
                                    <span
                                        className="font-semibold text-lg">Current: {scannedProduct.currentLocation.name}</span>
                                </div>
                                <div className="bg-white/20 px-3 py-1 rounded-full">
                                    <span
                                        className="text-sm font-medium">Qty: {scannedProduct.currentLocation.quantity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        {isExpanded && (
                            <div className="p-6 bg-gray-50 border-b">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500 w-20">Barcode:</span>
                                            <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{scannedProduct.barcode}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500 w-20">Size:</span>
                                            <span className="font-semibold text-gray-800">{scannedProduct.size}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500 w-16">Price:</span>
                                            <span className="font-bold text-xl text-green-600">{scannedProduct.price}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500 w-16">Disc:</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-lg text-red-600">{scannedProduct.discountPrice}</span>
                                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                    {scannedProduct.discount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Locations */}
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <FaMapMarkerAlt className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-800 text-lg">Other Locations</h3>
                                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">({scannedProduct.otherLocations.length})</span>
                            </div>

                            <div className="space-y-3">
                                {scannedProduct.otherLocations.map((location, index) => {
                                    const colorClasses = getLocationColorClasses(location.color);
                                    const dotColor = getLocationDotColor(location.color);
                                    const [fromColor, toColor, borderColor, bgColor, textColor] = colorClasses.split(' ');

                                    return (
                                        <div key={index} className={`flex items-center justify-between p-4 bg-gradient-to-r ${fromColor} ${toColor} rounded-lg border ${borderColor} hover:shadow-md transition-shadow`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 ${dotColor} rounded-full`}></div>
                                                <span className="font-medium text-gray-800">{location.name}</span>
                                            </div>
                                            <div className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-semibold`}>
                                                Qty: {location.quantity}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-gray-50 border-t">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleRescan}
                                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex-1"
                                    type="button"
                                >
                                    <FaRedo className="h-4 w-4" />
                                    <span>Re-scan</span>
                                </button>

                                <button
                                    onClick={handleClearSearch}
                                    className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex-1"
                                    type="button"
                                >
                                    <FaTimes className="h-4 w-4" />
                                    <span>Clear Search</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
                            <div className="text-sm text-gray-600">Total Stock</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="text-2xl font-bold text-green-600">{scannedProduct.otherLocations.length + 1}</div>
                            <div className="text-sm text-gray-600">Locations</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScanBarcodeForm;