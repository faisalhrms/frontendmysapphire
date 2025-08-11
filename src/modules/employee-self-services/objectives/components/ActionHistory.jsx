import React from 'react';
import { User } from 'lucide-react';

const ActionHistory = ({ actionHistory }) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Action History</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Action</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Remarks</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {actionHistory.map((action, index) => (
                        <tr key={index} className="">
                            <td className="px-6 py-4 border border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">{action.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 border border-gray-200">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {action.type}
                  </span>
                            </td>
                            <td className="px-6 py-4 border border-gray-200">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      action.action === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : action.action === 'Submit'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                  }`}>
                    {action.action}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 border border-gray-200">{action.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 border border-gray-200">{action.remarks || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActionHistory;