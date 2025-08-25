import React, { useState } from "react";
import OtherStoreInventoryTable from "@modules/inventory-tracker/components/OtherStoreInventoryTable.jsx";
import api from "@config/axiosConfig.js";
import { Search, Package, ChevronDown, ChevronUp, AlertCircle, Building2, Layers, Hash, Banknote, Truck, Globe, Boxes, Ruler, Grid3x3, Layers3, ExternalLink} from "lucide-react";
import EmptyState from "@components/EmptyState.jsx";

const ScanBarcode = ({ isActive }) => {
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOnlineStocksOpen, setIsOnlineStocksOpen] = useState(false);

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

    const syncTime = data?.sync_time || null;
    const updatedAt = data?.updated_at || null;
    const currentWarehouse = data?.item || null;
    const otherLocations = data?.other_stocks || [];
    const onlineStocks = data?.online_stocks || null;

    return (
        <>
            <div className="grid grid-cols-12 gap-x-4 mb-8">
                <div className="col-span-2"></div>
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 sm:col-span-8 col-span-12">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8 mt-8 dark:text-gray-200 dark:bg-bodybg">
                        <div className="p-6 border-b border-slate-200 ">
                            <h2 className="text-lg font-semibold text-slate-900 mb-1 dark:text-gray-200 dark:bg-bodybg ">Product Search</h2>
                            <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">Enter a barcode to retrieve comprehensive product information</p>
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
                                    className="block w-full pl-12 pr-32 py-4 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-all  dark:text-gray-200 dark:bg-bodybg"
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
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors  "
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
                    {
                        (syncTime || updatedAt) && (
                            <div className="flex justify-between mb-2 text-sm text-primary">
                                {syncTime ? <p>Data Fetched on: {syncTime}</p> : <div />}
                                {updatedAt && <p>Data Refreshed on: {updatedAt}</p>}
                            </div>
                        )
                    }

                    {data && (
                        <div className="space-y-6">
                            {currentWarehouse && (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ">
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
                                                        <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{currentWarehouse.salesprice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Banknote className="w-5 h-5 text-orange mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">Discount Price</p>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{currentWarehouse.discount_price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Layers className="w-5 h-5 text-info mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Product
                                                            Size</p>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{currentWarehouse.product_size}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <div className="flex">
                                                    <Truck className="w-5 h-5 text-danger mr-2"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">In Transit</p>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{currentWarehouse.intransit_qty || ""}</p>
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
                                                    <div
                                                        className="flex justify-between py-2 border-b border-slate-100">
                                                        <span className="text-sm text-slate-600">Rack Status</span>
                                                        <span
                                                            className="text-sm font-medium text-slate-900">{currentWarehouse.rack_location || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Matching Separate</h4>
                                                    <div className="space-y-3">
                                                        {currentWarehouse.combos && (
                                                            <div className="flex justify-between py-2 border-b border-slate-100">
                                                                <span className="text-sm text-slate-600">Quantity</span>
                                                                <span className="text-sm font-medium text-slate-900">{currentWarehouse.combos}</span>
                                                            </div>
                                                        )}
                                                        {currentWarehouse.shirt && (
                                                            <div className="flex justify-between py-2 border-b border-slate-100">
                                                                <span className="text-sm text-slate-600">Shirt</span>
                                                                <span className="text-sm font-medium text-slate-900">{currentWarehouse.shirt}</span>
                                                            </div>
                                                        )}

                                                        {currentWarehouse.trouser && (
                                                            <div className="flex justify-between py-2">
                                                                <span className="text-sm text-slate-600">Trouser</span>
                                                                <span className="text-sm font-medium text-slate-900">{currentWarehouse.trouser}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {otherLocations.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                                    <button
                                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors border-b border-slate-200 dark:text-gray-200 dark:bg-bodybg"
                                    >
                                        <div className="flex items-center">
                                            <Building2 className="w-5 h-5 text-slate-600 mr-3 dark:text-gray-200 dark:bg-bodybg"/>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 dark:bg-bodybg">
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
                                        <div className="border-t border-slate-200  ">
                                            <OtherStoreInventoryTable rows={otherLocations}/>
                                        </div>
                                    )}
                                </div>
                            )}
                            {onlineStocks && (
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg  ">
                                    <button
                                        onClick={() => setIsOnlineStocksOpen(!isOnlineStocksOpen)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors border-b border-slate-200 dark:text-gray-200 dark:bg-bodybg "
                                    >
                                        <div className="flex items-center">
                                            <Globe className="w-5 h-5 text-blue-600 mr-3 dark:text-gray-200 dark:bg-bodybg "/>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">
                                                Online Stock Information
                                            </h3>
                                            <span
                                                className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    onlineStocks.is_online === 'No'
                                                        ? 'bg-gray-100 text-gray-500'
                                                        : onlineStocks.onhand_qty > 0
                                                            ? 'bg-success/10 text-success'
                                                            : 'bg-danger/10 text-danger'
                                                }`}
                                            >
                                                {onlineStocks.is_online === 'No'
                                                    ? 'Not available'
                                                    : onlineStocks.onhand_qty > 0
                                                        ? 'In stock'
                                                        : 'Out of stock'}
                                            </span>
                                            {onlineStocks.is_online !== 'No' && (
                                                <a
                                                    href={`https://pk.sapphireonline.pk/collections/three-piece-unstitched/products/${onlineStocks.barcode}.html`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-info hover:text-info/10"
                                                    title="View Product"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        {isOnlineStocksOpen ? (
                                            <ChevronUp className="w-5 h-5 text-slate-500"/>
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-500"/>
                                        )}
                                    </button>

                                    {isOnlineStocksOpen && (
                                        <div className="p-6 bg-slate-50 dark:text-gray-200 dark:bg-bodybg ">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex items-center">
                                                        <Boxes className="w-5 h-5 text-info mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">On Hand
                                                                Quantity</p>
                                                            <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.onhand_qty}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex">
                                                        <Banknote className="w-5 h-5 text-success mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Unit
                                                                Price</p>
                                                            <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.salesprice}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg border border-slate-200  dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex">
                                                        <Banknote className="w-5 h-5 text-orange mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Discount
                                                                Price</p>
                                                            <p className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.discount_price}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-slate-200 dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex items-center">
                                                        <Ruler className="w-5 h-5 text-success mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Available
                                                                Sizes</p>
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.sizes || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-slate-200 dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex items-center">
                                                        <Grid3x3 className="w-5 h-5 text-primary mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">(MS)</p>
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.combos || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-slate-200 dark:text-gray-200 dark:bg-bodybg ">
                                                    <div className="flex items-center">
                                                        <Layers3 className="w-5 h-5 text-orange mr-2"/>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 dark:text-gray-200 dark:bg-bodybg ">(MS)
                                                                Size</p>
                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg ">{onlineStocks.size_set || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
