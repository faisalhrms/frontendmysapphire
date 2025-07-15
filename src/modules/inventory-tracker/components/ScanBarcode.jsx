import React, { useState } from "react";
import OtherStoreInventoryTable from "@modules/inventory-tracker/components/OtherStoreInventoryTable.jsx";
import api from "@config/axiosConfig.js";
import { Search, Package, MapPin, Percent, ChevronDown, ChevronUp, AlertCircle, Building2, Layers, Hash, Banknote } from "lucide-react";
import EmptyState from "@components/EmptyState.jsx";

const ScanBarcode = ({ isActive }) => {
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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

    const currentWarehouse = data?.item || null;
    const otherLocations = data?.other_stocks || [];

    return (
        <>
            <div className="grid grid-cols-12 gap-x-4 min-h-screen">
                <div className="col-span-2"></div>
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 sm:col-span-8 col-span-12">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8 mt-8">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">Product Search</h2>
                            <p className="text-sm text-slate-600">Enter a barcode to retrieve comprehensive product
                                information</p>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-slate-400"/>
                                </div>
                                <input
                                    type="text"
                                    autoComplete="on"
                                    name="barcode_search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="block w-full pl-12 pr-32 py-4 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-all"
                                    placeholder="Enter barcode number (e.g., 1234567890123)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <button
                                        onClick={handleSearch}
                                        disabled={isLoading || !searchValue.trim()}
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4 mr-2"/>
                                                Search Product
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!data && !isLoading && !error && (
                        <EmptyState
                            icon={Package}
                            heading="No Results"
                            description="Enter a barcode to search for product information"
                        />
                    )}
                    {data && (
                        <div className="space-y-6">
                            {currentWarehouse && (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-800 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Building2 className="w-5 h-5 text-slate-300 mr-3"/>
                                                <h3 className="text-lg font-semibold text-white">{currentWarehouse.warehousename}</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">{currentWarehouse.onhand_qty} units</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 border-b border-slate-200">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Banknote className="w-5 h-5 text-success mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">Unit Price</p>
                                                        <p className="text-lg font-bold text-slate-900">{currentWarehouse.salesprice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Percent className="w-5 h-5 text-orange mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">Discount
                                                            Rate</p>
                                                        <p className="text-lg font-bold text-slate-900">{currentWarehouse.discount_per}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Layers className="w-5 h-5 text-info mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">Product
                                                            Size</p>
                                                        <p className="text-lg font-bold text-slate-900">{currentWarehouse.product_size}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <MapPin className="w-5 h-5 text-primary mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">Rack
                                                            Location</p>
                                                        <p className="text-lg font-bold text-slate-900">{currentWarehouse.rack_location || ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Product
                                                    Information</h4>
                                                <div className="space-y-3">
                                                    <div
                                                        className="flex justify-between py-2 border-b border-slate-100">
                                                        <span className="text-sm text-slate-600">Barcode Number</span>
                                                        <span
                                                            className="text-sm font-medium text-slate-900 font-mono">{currentWarehouse.barcode}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between py-2 border-b border-slate-100">
                                                        <span className="text-sm text-slate-600">Available Sizes</span>
                                                        <span
                                                            className="text-sm font-medium text-slate-900">{currentWarehouse.sizes}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Product
                                                    Sets & Combinations</h4>
                                                <div className="space-y-3">
                                                    <div
                                                        className="flex justify-between py-2 border-b border-slate-100">
                                                    <span
                                                        className="text-sm text-slate-600">Matching Separate (MS)</span>
                                                        <span
                                                            className="text-sm font-medium text-slate-900">{currentWarehouse.combos}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2">
                                                        <span className="text-sm text-slate-600">Matching Separate (MS) Size</span>
                                                        <span
                                                            className="text-sm font-medium text-slate-900">{currentWarehouse.size_set}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {otherLocations.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors border-b border-slate-200"
                                    >
                                        <div className="flex items-center">
                                            <Building2 className="w-5 h-5 text-slate-600 mr-3"/>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                Additional Warehouse Locations
                                            </h3>
                                            <span
                                                className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {otherLocations.length} locations
                                    </span>
                                        </div>
                                        {isAccordionOpen ? (
                                            <ChevronUp className="w-5 h-5 text-slate-500"/>
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-500"/>
                                        )}
                                    </button>

                                    {isAccordionOpen && (
                                        <div className="border-t border-slate-200">
                                            <OtherStoreInventoryTable rows={otherLocations}/>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {error && !data && !isLoading && (
                        <div className="alert alert-danger flex items-center">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"/>
                                <div>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ScanBarcode;
