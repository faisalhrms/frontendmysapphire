import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx";
import { useForm, Controller } from "react-hook-form";

import { FaCamera } from "react-icons/fa";
import FilterButton from "@components/form/FilterButton.jsx";

const ScanBarcdeForm = ({setFilters,filters , data}) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);


    const currentWarehouse = data?.item||{};

    const otherLocations = data?.other_stocks||[];

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
        setFilters({...filters,barcode:data?.scan})
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

                            <div className="w-full max-w-2xl mx-auto  ">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
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
                                        className="flex-grow px-4 py-3 bg-transparent border-0 text-gray-300 placeholder-gray-400 focus:outline-none text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit(onSubmit)()}
                                        className="bi bi-search bg-gray-800 hover:bg-blue-600 text-white p-3 transition-colors duration-200 flex items-center justify-center h-12"
                                    >

                                    </button>
                                </div>


                        </div>
                        {/*<div className="flex items-center">*/}
                        {/*    <FormInput*/}
                        {/*        is_required={false}*/}
                        {/*        name="scan"*/}
                        {/*        control={control}*/}
                        {/*        errors={errors}*/}
                        {/*        onKeyDown={(e) => {*/}
                        {/*            if (e.key === "Enter") {*/}
                        {/*                e.preventDefault();*/}
                        {/*                handleSubmit(onSubmit)();*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*        className="pr-10 rounded-lg border-2 flex-grow border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out flex-grow mr-4"*/}
                        {/*    />*/}
                        {/*    <button*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => handleSubmit(onSubmit)()}*/}
                        {/*        className="ti-btn ti-btn-primary  !mb-0 ml-4"*/}
                        {/*    >*/}
                        {/*        Submit*/}
                        {/*    </button>*/}
                        {/*</div>*/}

                    </div>


                </div>
            </div>


            {data && <div className="max-w-4xl mx-auto bg-white font-sans mb-4">
                {/* Current Warehouse Header */}
                <div className="border-2 border-black mb-1">
                    <div className="flex items-center px-4 py-3 bg-white">
                        <div className="bi bi-caret-right-fill text-black w-5 h-5 mr-2 fill-black"/>
                        <span className="text-lg text-gray-700">
            Current: {currentWarehouse.warehousename} (Qty: {currentWarehouse.onhand_qty})
          </span>
                    </div>
                </div>

                {/* Product Details */}
                <div className="border-2 border-black mb-1">
                    <div className="px-4 py-6 bg-white">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <span className="text-lg text-gray-700">Barcode: </span>
                                    <span className="text-lg text-gray-700">{currentWarehouse.barcode}</span>
                                </div>
                                <div>
                                    <span className="text-lg text-gray-700">Size: </span>
                                    <span className="text-lg text-gray-700">{currentWarehouse.sizes}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-lg text-gray-700">Price: </span>
                                    <span className="text-lg text-gray-700">{currentWarehouse.salesprice}</span>
                                </div>
                                <div>
                                    <span className="text-lg text-gray-700">Disc: </span>
                                    <span className="text-lg text-gray-700">{currentWarehouse.discount_per}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Locations */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center px-4 py-3 text-lg text-gray-700 bg-white w-full text-left"
                    >
                        {isExpanded ? (
                            <div className=" bi bi-caret-right-fill text-black w-5 h-5 mr-2 transform rotate-90"/>
                        ) : (
                            <div className="bi bi-caret-right-fill text-black w-5 h-5 mr-2"/>
                        )}
                        Other Locations ({otherLocations.length}):
                    </button>

                    {isExpanded && (
                        <div className="pl-8 bg-white">
                            {otherLocations.map((location, index) => (
                                <div key={index} className="py-2">
                                    <span
                                        className="text-lg text-gray-700">• {location.warehousename} (Qty: {location.onhand_qty})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-6 ml-4 mb-4">
                    <button
                        type="button"
                        className="ti-btn ti-btn-success !mb-0 text-white font-medium text-sm rounded py-2 px-3"

                    >
                        <i className="bi bi-arrow-clockwise"></i>
                                re-fresh
                    </button>

                    <button
                        type="button"
                        className="ti-btn ti-btn-primary !mb-0 text-white font-medium text-sm rounded py-2 px-3"

                    >
                        <i className="bi bi-x"></i
                            >
                        clear
                    </button>
                </div>
            </div>}
        </form>
    );
};

export default ScanBarcdeForm;


