import {Link} from "react-router-dom";
import React from "react";
import FileItem from "@modules/media/components/FileItem.jsx";


const FileMeta = ({file}) => {
    return(
        <>
            <div className={`selected-file-details`}>
                <div className="flex p-6 items-center justify-between border-b dark:border-defaultborder/10">
                    <div>
                        <h6 className="font-semibold mb-0 dark:text-gray-200 dark:bg-bodybg">File Details</h6>
                    </div>
                </div>
                <div className="filemanager-file-details" id="filemanager-file-details">
                    <div className="p-4 text-center border-b border-dashed dark:border-defaultborder/10 ">
                        <div className="file-details mb-4 !inline-flex">
                               <FileItem file={file} meta={true} />
                        </div>
                    </div>
                    <div className="p-4 border-b border-dashed dark:border-defaultborder/10">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <div>
                                    <span
                                        className="font-semibold dark:text-gray-200 dark:bg-bodybg">File Format : </span><span
                                    className="text-[.75rem] text-[#8c9097] dark:text-white/50">{file.file_extension}</span>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div>
                                    <p className="font-semibold mb-0 dark:text-gray-200 dark:bg-bodybg">File Description
                                        : </p>
                                    <span className="text-[.75rem] text-[#8c9097] dark:text-white/50">
                                        {`The size of this file is ${file.file_size}KB. ${file.file_type.startsWith('image/') ? `The dimensions of this file are ${file.file_height}px in height & ${file.file_width}px in width.` : ''}`}
                                    </span>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <p className="font-semibold mb-0 dark:text-gray-200 dark:bg-bodybg"> Uploaded By : </p>
                                <span
                                    className="text-[.75rem] text-[#8c9097] dark:text-white/50">{file?.created_by?.full_name} ({file?.created_by?.email})</span>
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 border-b border-dashed dark:border-defaultborder/10">
                        <p className="mb-1 font-semibold dark:text-gray-200 dark:bg-bodybg">Downloaded from :</p>
                        <Link
                            className="text-primary font-semibold break-words"
                            to={file.file_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <u>{file.file_url}</u>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileMeta;