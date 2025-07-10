import React, { useState } from "react";
import OtherStoreInventoryTable from "@modules/inventory-tracker/components/OtherStoreInventoryTable.jsx";
import api from "@config/axiosConfig.js";
import srs from "@assets/files/inventory_tracker_srs.pdf";
import dfd from "@assets/files/inventory_tracker_dfd.pdf";

const ScanBarcode = ({ isActive }) => {
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const accordionHeadingId = "other-locations-heading";
    const accordionCollapseId = "other-locations-collapse";

    const handleSearch = async () => {
        const cleanValue = searchValue.replace(/\s+/g, '');
        if (!cleanValue) return;
        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await api.get(`inventory-tracker/barcode/`, {
                params: {
                    barcode: cleanValue,
                },
            });
            const result = response.data?.data;
            setData(result);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const currentWarehouse = data?.item || {};
    const otherLocations = data?.other_stocks || [];

    return (
        <>
            <div className="grid grid-cols-12 gap-x-4 min-h-screen">
                <div className="col-span-2"></div>
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 sm:col-span-8 col-span-12">
                    <div className="custom-form-group mb-4">
                        <input
                            type="search"
                            autoComplete="on"
                            name='barcode_search'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="form-control !py-4 !px-6 w-full !rounded-md form-control-lg shadow-sm"
                            placeholder="Search by barcode.."
                            aria-label="Search input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <div className="custom-form-btn">
                            <button
                                className="ti-btn bg-primary text-white !font-medium !border dark:border-defaultborder/10-0"
                                type="button"
                                onClick={handleSearch}>
                                <i className="bi bi-search me-2"></i> Search
                            </button>
                        </div>
                    </div>

                    {error && !data && !isLoading && (
                        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-danger mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-danger font-medium">Error: {error}</span>
                            </div>
                        </div>
                    )}

                    {data && data.item && (
                        <div className="max-w-4xl mx-auto bg-white font-sans mb-4 p-4 sm:p-6">
                            {/* Current warehouse info */}
                            <div className="border-2 border-black mb-1">
                                <div className="flex items-center justify-between px-4 py-3 bg-white">
                            <span className="text-sm text-black font-semibold">
                                Current: {currentWarehouse.warehousename} (Qty: {currentWarehouse.product_size} {currentWarehouse.onhand_qty})
                            </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-black">Price:</span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.salesprice}</span>
                                        <span className="text-base font-bold text-black">- Disc: </span>
                                        <span className="text-sm text-gray-700">{currentWarehouse.discount_per}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 border-black mb-1">
                                <div className="px-4 py-6 bg-white">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-base font-bold text-black">Barcode: </span>
                                                <span
                                                    className="text-base text-gray-800">{currentWarehouse.barcode}</span>
                                            </div>
                                            <div>
                                                <span
                                                    className="text-base font-bold text-black">Matching Separate (MS): </span>
                                                <span className="text-sm text-gray-700">{currentWarehouse.combos}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-base font-bold text-black">Size: </span>
                                                <span className="text-sm text-gray-700">{currentWarehouse.sizes}</span>
                                            </div>
                                            <div>
                                                <span className="text-base font-bold text-black">(MS) Size: </span>
                                                <span
                                                    className="text-sm text-gray-700">{currentWarehouse.size_set}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-base font-bold text-black">Rack Location: </span>
                                                <span className="text-sm text-gray-700">Not Available</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="accordion accordion-border-primary accordions-items-seperate mb-6 w-full"
                                id="accordion-other-locations">
                                <div className="hs-accordion-group">
                                    <div className="hs-accordion accordion-item" id={accordionHeadingId}>
                                        <button
                                            className="hs-accordion-toggle accordion-button hs-accordion-active:pb-3 group py-3 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-left transition bg-white"
                                            type="button"
                                            aria-controls={accordionCollapseId}
                                        >
                                            Other Locations ({otherLocations.length})
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
                                                <OtherStoreInventoryTable rows={otherLocations}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-span-2 text-center">
                    <div className="hs-dropdown ti-dropdown">
                        <a aria-label="anchor" href="#"
                           className="flex items-center text-primary justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-primary/10 border-primary shadow-none !font-medium"
                           aria-expanded="false">
                            <i className="fe fe-more-vertical"></i>
                        </a>

                        <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                            <li>
                                <a
                                    href={srs}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex"
                                >
                                    <i className="ri-file-pdf-line me-1 align-middle"></i>View SRS
                                </a>
                            </li>
                            <li>
                                <a
                                    href={dfd}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex"
                                >
                                    <i className="ri-file-pdf-line me-1 align-middle"></i>View DFD
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScanBarcode;
