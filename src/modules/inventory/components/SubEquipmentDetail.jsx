import React from "react";

const SubEquipmentDetail = ({ equipmentData }) => {
    const { sub_equipments = [] } = equipmentData;

    return (
        <div className="box mt-4">
            <div className="box-header">
                <div className="box-title">Sub Equipment</div>
            </div>
            <div className="box-body">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Sub Equipment Type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Description
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Qty
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sub_equipments.length > 0 ? (
                        sub_equipments.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{item.type.name}</td>
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2">{item.qty}</td>
                                <td className="px-4 py-2">{item.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                className="px-4 py-2 text-center"
                                colSpan="4"
                            >
                                No Sub Equipment Available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubEquipmentDetail;
