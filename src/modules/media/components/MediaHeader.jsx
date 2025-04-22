const MediaHeader = ({ handleSearchChange, totalFiles, onFileChange, selectedFilesCount, needSelectedValue, handleSubmit }) => {
    return (
        <div className="flex p-4 items-center justify-between border-b dark:border-defaultborder/10">
            <div className="flex items-center gap-6 flex-grow">
                <div className="relative min-w-[200px]">
                    <input
                        type="text"
                        className="form-control w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                        placeholder="Search Files"
                        onChange={handleSearchChange}
                    />
                    <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <div className="text-sm ">
                    <span>Total: <strong>{totalFiles} files</strong></span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {selectedFilesCount > 0 && (
                    <div className="text-sm ">
                        <span><strong>{selectedFilesCount}</strong> Files selected</span>
                    </div>
                )}

                {needSelectedValue && (
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="ti-btn  ti-btn-success text-white flex items-center font-medium gap-2 px-4 py-2 rounded-md transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Save Selected File
                    </button>
                )}

                <label htmlFor="uploadFile1"
                       className="flex  bg-primary hover:bg-primary/70 text-white text-base font-medium px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2 fill-white inline" viewBox="0 0 32 32">
                        <path
                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                            data-original="#000000"/>
                        <path
                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                            data-original="#000000"/>
                    </svg>
                    Upload
                    <input
                        id="uploadFile1"
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
};

export default MediaHeader;