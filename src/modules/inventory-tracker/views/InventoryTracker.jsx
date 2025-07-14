import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import ScanBarcode from "@modules/inventory-tracker/components/ScanBarcode.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import { Package } from "lucide-react";
import srs from "@assets/files/inventory_tracker_srs.pdf";
import dfd from "@assets/files/inventory_tracker_dfd.pdf";
import pdfIcon from "@assets/images/icon/pdf.png";

const InventoryTracker = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <div className="block justify-between page-header border-b border-slate-200 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Package className="w-8 h-8 text-slate-700 mr-3"/>
                                <div>
                                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-[1.125rem] font-semibold">Inventory Tracker System</h3>
                                    <p className="text-sm text-slate-600">Search for products by barcode</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <a
                                    href={srs}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                    <img alt='View SRS' src={pdfIcon} className="w-6 h-6 mr-2"/>
                                    View SRS
                                </a>
                                <a
                                    href={dfd}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                    <img alt='View DFD' src={pdfIcon} className="w-6 h-6 mr-2"/>
                                    View DFD
                                </a>
                            </div>
                        </div>
            </div>
            <IconTabs
                    tabs={[
                        {
                            id: "scan_bar_code",
                            label: "Search Barcode",
                            icon: <i className="bx bx-barcode"></i>,
                            content: (
                                <ScanBarcode isActive={activeTab === 'scan_bar_code'}/>
                            )
                        },
                        {
                            id: "inventory_product",
                            label: "Product List",
                            icon: <i className="bx bx-list-ul"></i>,
                            content: (
                                <ProductDatatableTab isActive={activeTab === 'inventory_product'}/>
                            )
                        }
                    ]}
                    onTabChange={handleTabChange}
                />
            </>
            );
};

export default InventoryTracker;
