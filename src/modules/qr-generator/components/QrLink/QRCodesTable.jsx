import { Edit3, Download, Trash2 } from 'lucide-react';

const QRCodesTable = ({ qrCodes, onEdit, onDelete, onDownload }) => {
    if (qrCodes.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your QR Codes</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4">Preview</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">URL</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {qrCodes.map((qr) => (
                        <tr key={qr.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <img src={qr.dataURL} alt="QR Code" className="w-12 h-12" />
                            </td>
                            <td className="py-3 px-4 font-medium">{qr.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{qr.url}</td>
                            <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                    {qr.category}
                  </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(qr.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(qr)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDownload(qr)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(qr.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QRCodesTable;