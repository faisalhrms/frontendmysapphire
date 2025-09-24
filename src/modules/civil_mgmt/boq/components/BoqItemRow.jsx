import {Hash} from "lucide-react";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import React from "react";

const BoqItemRow = ({item, index}) => {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-4 text-sm">
                <div className="w-6 h-6 bg-primary/10 text-primary text-xs font-medium rounded flex items-center justify-center">
                    {index + 1}
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono rounded border">
                        <Hash size={10} />
                        {item.item_no}
                    </div>
                    <div className="font-medium text-sm text-gray-900">{item.name}</div>
                </div>
            </td>
            <td className="px-4 py-4 text-center">
                <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-blue-200">
                    {item.unit}
                </span>
            </td>
            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                {item.quantity.toLocaleString()}
            </td>
            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                {formatAmountWithCommas(item.rate)}
            </td>
            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                {formatAmountWithCommas(item.amount)}
            </td>
        </tr>

    )
}

export default BoqItemRow;