import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import FormInput from "@components/form/FormInput.jsx";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import api from "@config/axiosConfig.js";
import OtherStoreInventoryTable from "@modules/inventory-tracker/components/OtherStoreInventoryTable.jsx";

const ScanBarcodeForm = ({ isActive }) => {
    if (!isActive) {
        return null;
    }
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [scanning, setScanning] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchBarcodeData = async (barcode) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`inventory-tracker/barcode/`, {
                params: {
                    barcode: barcode,
                },
            });

            const result = response.data?.data;
            setData(result);
            // Note: no manual expand here; accordion will be visible but collapsed initially.
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const startScanner = async () => {
        setScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            if (videoRef.current) {
                await codeReader.current.decodeFromStream(
                    stream,
                    videoRef.current,
                    (result, err) => {
                        if (result) {
                            stopScanner();
                            setValue("scan", result.getText());
                            setHasSearched(true);
                            fetchBarcodeData(result.getText());
                            console.log("Scanned barcode:", result.getText());
                        }
                        if (err && !(err instanceof NotFoundException)) {
                            console.error("QR scan error:", err);
                        }
                    }
                );
            }
        } catch (err) {
            console.error("Error starting scanner:", err);
            setScanning(false);
        }
    };

    const stopScanner = () => {
        codeReader.current.reset();
        setScanning(false);
    };

    const handleScanClick = () => {
        if (scanning) {
            stopScanner();
        } else {
            startScanner();
        }
    };

    const onSubmit = (formData) => {
        if (formData?.scan && formData.scan.trim() !== "") {
            setHasSearched(true);
            fetchBarcodeData(formData.scan);
            console.log("Submitted barcode:", formData.scan);
        } else {
            setHasSearched(true);
        }
    };

    const handleReScan = () => {
        setData(null);
        setError(null);
        setValue("scan", "");
        // Optionally restart scanner:
        startScanner();
    };

    const handleClearSearch = () => {
        setValue("scan", "");
        setScanning(false);
        setHasSearched(false);
        setIsLoading(false);
        setData(null);
        setError(null);
        stopScanner();
    };

    useEffect(() => {
        return () => {
            // Cleanup on component unmount
            stopScanner();
        };
    }, []);

    // Generate unique IDs for accordion heading/content.
    // If you render multiple ScanBarcodeForm instances, you may want to ensure uniqueness.
    const accordionHeadingId = "other-locations-heading";
    const accordionCollapseId = "other-locations-collapse";

    const currentWarehouse = data?.item || {};
    const otherLocations = data?.other_stocks || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="text-black flex flex-col items-center">
            {/* Scanner & input area */}
            <div className="xl:col-span-4 col-span-4">
                <div className="box shadow-lg rounded-lg bg-white p-3">
                    <div
                        className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
                        style={{
                            height: "200px",
                            transition: "all 0.3s",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {scanning ? (
                            <video ref={videoRef} style={{ width: "100%", height: "100%" }} />
                        ) : (
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
                            <div className="flex items-center border-2 border-gray-300 rounded-lg">
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
                                    className="flex-grow px-2 py-2 bg-transparent border-0 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(onSubmit)()}
                                    disabled={isLoading}
                                    className={`${
                                        isLoading
                                            ? "bi-btn ti-btn-primary text-center cursor-not-allowed"
                                            : "bg-primary hover:bg-blue-600"
                                    } bg-primary w-10 py-3 rounded-lg flex items-center justify-center`}
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

            {/* Error message */}
            {error && !data && !isLoading && (
                <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-red-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-red-700 font-medium">Error: {error}</span>
                    </div>
                </div>
            )}

            {/* Data found */}
            {data && data.item && (
                <div className="max-w-4xl mx-auto bg-white font-sans mb-4 p-4 sm:p-6">
                    {/* Current warehouse info */}
                    <div className="border-2 border-black mb-1">
                        <div className="flex items-center px-4 py-3 bg-white">
              <span className="text-sm text-black font-semibold">
                Current: {currentWarehouse.warehousename} (Qty: {currentWarehouse.onhand_qty})
              </span>
                        </div>
                    </div>

                    {/* Details grid */}
                    <div className="border-2 border-black mb-1">
                        <div className="px-4 py-6 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-base font-bold text-black">Barcode: </span>
                                        <span className="text-base text-gray-800">{currentWarehouse.barcode}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold text-black">Size: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.sizes}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-base font-bold text-black">Price: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.salesprice}</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-bold text-black">Disc: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.discount_per}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accordion for Other Locations */}
                    <div className="accordion accordion-border-primary accordions-items-seperate mb-6 w-full" id="accordion-other-locations">
                        <div className="hs-accordion-group">
                            <div className="hs-accordion accordion-item" id={accordionHeadingId}>
                                <button
                                    className="hs-accordion-toggle accordion-button hs-accordion-active:pb-3 group py-3 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-left transition bg-white"
                                    type="button"
                                    aria-controls={accordionCollapseId}
                                >
                                    {/* Icon changes automatically via HS classes if configured */}
                                    Other Locations ({otherLocations.length})
                                    {/* Optionally, you can still include the SVG arrows here if your HS setup toggles classes, e.g.: */}
                                    <span className="flex-shrink-0">
                    <svg
                        className="hs-accordion-active:hidden block w-3 h-3 text-primary"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                      />
                    </svg>
                    <svg
                        className="hs-accordion-active:block hidden w-3 h-3 text-primary"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                      />
                    </svg>
                  </span>
                                </button>
                                <div
                                    id={accordionCollapseId}
                                    className="hs-accordion-content accordion-collapse w-full hidden transition-[height] duration-300 bg-white"
                                    aria-labelledby={accordionHeadingId}
                                >
                                    <div className="pl-4 pt-2 pb-4">
                                        <OtherStoreInventoryTable rows={otherLocations} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons: Re-scan, Clear Search */}
                    <div className="flex items-center gap-4 mt-4 ml-2 mb-4">
                        <button
                            type="button"
                            className="ti-btn ti-btn-success !mb-0 text-white text-sm rounded py-2 px-3"
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

            {/* No data found */}
            {hasSearched && !isLoading && (!data || !data.item) && !error && (
                <div className="mx-auto bg-white font-sans mb-4 p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center">
                        <svg
                            className="custom-alert-icon fill-warning inline-flex"
                            xmlns="http://www.w3.org/2000/svg"
                            height="50px"
                            viewBox="0 0 24 24"
                            width="50px"
                            fill="#000000"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-700 mb-4">No Data Found</h3>
                    <p className="mb-2">
                        The scanned barcode could not be found in the system or doesn't match the expected format.
                    </p>
                    <p className="mb-4 text-sm">
                        Please scan a valid product barcode or check if the barcode is correct.
                    </p>
                    <div className="flex items-center gap-4 mt-8 ml-2 mb-2">
                        <button
                            type="button"
                            className="ti-btn ti-btn-success !mb-0 text-white text-sm rounded py-2 px-3"
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

export default ScanBarcodeForm;
