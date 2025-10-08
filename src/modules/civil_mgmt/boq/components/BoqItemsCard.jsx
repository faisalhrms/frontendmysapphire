import {Calculator, Grid3X3, Package2} from "lucide-react";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import React from "react";
import BoqItemRow from "@modules/civil_mgmt/boq/components/BoqItemRow.jsx";

const BoqItemsCard = ({itemData}) => {
    return (
        <div className="box">
            <div className="box-header justify-between px-6 py-4 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center dark:text-gray-200 dark:bg-bodybg">
                            <Grid3X3 size={16}/>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">BOQ Items</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">Construction items breakdown</p>
                        </div>
                    </div>
                    <div
                        className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg">
                        {itemData?.items?.length || 0} items
                    </div>
                </div>
            </div>

            {itemData?.items && itemData.items.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    Item Details
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    Unit
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    Quantity
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    Rate
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 dark:text-gray-200 dark:bg-bodybg">
                            {itemData.items.map((item, index) => (
                                <BoqItemRow key={item.id} item={item} index={index}/>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Grand Total */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <div className="flex justify-end">
                            <div
                                className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-l dark:text-gray-200 dark:bg-bodybg">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                        <Calculator size={16}/>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Grand Total</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">Final amount</div>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-primary">
                                    {formatAmountWithCommas(itemData?.total_amount || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:text-gray-200 dark:bg-bodybg">
                        <Package2 className="w-8 h-8 text-gray-400"/>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-200 dark:bg-bodybg">No Items Found</h4>
                    <p className="text-gray-600 dark:text-gray-200 dark:bg-bodybg">This tender doesn't have any BOQ items yet.</p>
                </div>
            )}
        </div>
    )
}

export default BoqItemsCard;