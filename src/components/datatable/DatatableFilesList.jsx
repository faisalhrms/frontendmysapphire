import {Eye} from "lucide-react";
import React from "react";

const DatatableFilesList = ({files = []}) => {
    return (
        <>
            <div className="flex space-x-2">
                {files.map(file => (
                    <a
                        key={file.id}
                        href={file.file_url}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <Eye className="h-3 w-3 mr-1"/>
                        View
                    </a>
                ))}
            </div>
        </>
    )
}

export default DatatableFilesList