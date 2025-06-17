import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx";
import { useForm, Controller } from "react-hook-form";
import { FaCamera } from "react-icons/fa";

const ScanBarcdeForm = ({ setFilters, filters, data }) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const currentWarehouse = data?.item || {};
    const otherLocations = data?.other_stocks || [];

    useEffect(() => {
        if (hasSearched && (data || data === null || data === undefined)) {
            setIsLoading(false);
        }
    }, [data, hasSearched]);

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
                    setHasSearched(true);
                    setIsLoading(true);

                    setFilters({ ...filters, barcode: decodedText });
                    console.log("Scanned barcode:", decodedText);
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    };

    const onSubmit = (data) => {
        if (data?.scan && data.scan.trim() !== "") {
            setIsLoading(true);
            setFilters({ ...filters, barcode: data?.scan });
            setHasSearched(true);
            console.log("Submitted barcode:", data.scan);
        } else {
            setHasSearched(true);
        }
    };

    const handleReScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                document.getElementById("reader").innerHTML = "";
                setScanning(false);
            });
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
                    setHasSearched(true);
                    setIsLoading(true);

                    setFilters({ ...filters, barcode: decodedText });
                    console.log("Re-scanned barcode:", decodedText);
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    };

    const handleClearSearch = () => {
        setValue("scan", "");
        setScanning(false);
        setHasSearched(false);
        setIsLoading(false);
        document.getElementById("reader").innerHTML = "";
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className=" text-black flex flex-col items-center">
            <div className="xl:col-span-4 col-span-4">
                <div className="box shadow-lg rounded-lg bg-white p-3">
                    <div className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
                         style={{
                             height: "200px",
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
                                <FaCamera className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                    <div className="p-4 w-full max-w-md mx-auto">
                        <label htmlFor="scan" className="block text-sm font-medium text-gray-700 mb-2">
                            Scan or type barcode
                        </label>

                        <div className="w-full max-w-2xl mx-auto">
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
                                    disabled={isLoading}
                                    className={`${
                                        isLoading
                                            ? 'bi-btn ti-btn-primary cursor-not-allowed'
                                            : 'bg-primary hover:bg-blue-600'
                                    } bg-primary w-10    py-3  `}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <i className="bi bi-search text-white ml-2 mr-2"></i>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {data && data.item && (
                <div className="max-w-4xl mx-auto bg-white font-sans mb-4 p-4 sm:p-6">
                    <div className="border-2 border-black mb-1">
                        <div className="flex items-center px-4 py-3 bg-white">

                            <span className="text-sm text-gray-700 font-semibold">
                                Current: {currentWarehouse.warehousename} (Qty: {currentWarehouse.onhand_qty})
                            </span>
                        </div>
                    </div>

                    <div className="border-2 border-black mb-1">
                        <div className="px-4 py-6 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Barcode: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.barcode}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Size: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.sizes}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Price: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.salesprice}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Disc: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.discount_per}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center px-4 py-3 text-lg text-gray-700 bg-white w-full text-left rounded-md hover:bg-gray-100"
                        >
                            {isExpanded ? (
                                <div className="bi bi-caret-right-fill text-black w-5 h-5 mr-2 transform rotate-90"/>
                            ) : (
                                <div className="bi bi-caret-right-fill text-black w-5 h-5 mr-2"/>
                            )}
                            Other Locations ({otherLocations.length}):
                        </button>

                        {isExpanded && (
                            <div className="pl-8 bg-white max-h-80 overflow-y-auto">
                                {otherLocations.map((location, index) => (
                                    <div key={index} className="py-2">
                                        <span className="text-lg text-gray-700">• {location.warehousename} (Qty: {location.onhand_qty})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 ml-2 mb-4">
                        <button
                            type="button"
                            className="ti-btn ti-btn-success !mb-0 text-white  text-sm rounded py-2 px-3"
                            onClick={handleReScan}
                            disabled={isLoading}
                        >
                            <i className="bi bi-arrow-clockwise"></i> Re-scan
                        </button>

                        <button
                            type="button"
                            className="ti-btn ti-btn-primary !mb-0 text-white text-sm rounded py-2 px-3"
                            onClick={handleClearSearch}
                            disabled={isLoading}
                        >
                            <i className="bi bi-x"></i> Clear Search
                        </button>
                    </div>
                </div>
            )}


            {hasSearched && (!data || !data.item) && (
                <div className=" mx-auto bg-white font-sans mb-4 p-4 sm:p-6 text-center  ">

                        <div className="flex items-center justify-center ">
                            <svg className="custom-alert-icon fill-warning inline-flex"
                                 xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 0 24 24"
                                 width="50px" fill="#000000">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>

                        </div>
                        <h3 className="text-lg font-semibold text-red-700  mb-4">No Data Found</h3>
                        <p className=" mb-2">
                            The scanned barcode could not be found in the system or doesn't match the expected format.
                        </p>
                        <p className=" mb-4 text-sm">
                            Please scan a valid product barcode or check if the barcode is correct.
                        </p>
                        <div className="flex items-center gap-4 mt-8 ml-2 mb-2">
                            <button
                                type="button"
                                className="ti-btn ti-btn-success !mb-0 text-white  text-sm rounded py-2 px-3"
                                onClick={handleReScan}
                                disabled={isLoading}
                            >
                                <i className="bi bi-arrow-clockwise"></i> Re-scan
                            </button>
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary !mb-0 text-white text-sm rounded py-2 px-3"
                                onClick={handleClearSearch}
                                disabled={isLoading}
                            >
                                <i className="bi bi-x"></i> Clear Search
                            </button>
                        </div>
                    </div>

            )}
        </form>
    );
};

export default ScanBarcdeForm;