const MediaHeader = ({ handleSearchChange, totalFiles, onFileChange, selectedFilesCount,  needSelectedValue, handleSubmit }) => {
    return (
        <div className="flex p-4 flex-wrap gap-2 items-center justify-between border-b dark:border-defaultborder/10">
            <div className="dark:border-defaultborder/10">
                <input
                    type="text"
                    className="form-control !bg-light border-0 !rounded-s-sm"
                    placeholder="Search Files"
                    onChange={handleSearchChange}
                />
            </div>
            <small><i>Total: {totalFiles} files</i></small>
            <div>
                <label className="block">
                    <span className="sr-only">Choose Files</span>
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50 file:me-4 file:py-2 file:px-4 file:rounded-s-sm file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary focus-visible:outline-none"
                    />
                </label>
            </div>
            {
                selectedFilesCount > 0 &&
                (
                    <small><i>{selectedFilesCount} Files selected.</i></small>
                )
            }
            {
                needSelectedValue &&
                (
                    <div className="grid grid-cols-1 justify-items-end">
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="ti-btn ti-btn-success">Choose Selected File
                        </button>
                    </div>
                )
            }
        </div>
    )
        ;
};

export default MediaHeader;
