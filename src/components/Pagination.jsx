import { useMemo } from 'react';

const Pagination = ({ currentPage, totalPages, paginationDisabled, onPageChange, justify = 'end', mb = 4 }) => {
    const prevPage = () => {
        if (currentPage > 1 && !paginationDisabled) {
            onPageChange(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages && !paginationDisabled) {
            onPageChange(currentPage + 1);
        }
    };

    const gotoPage = (page) => {
        if (!paginationDisabled) {
            onPageChange(page);
        }
    };

    const pages = useMemo(() => {
        const maxPages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        const endPage = Math.min(totalPages, startPage + maxPages - 1);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }, [currentPage, totalPages]);

    if (totalPages <= 0) return null;

    return (
        <>
            <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12 mb-3">
                <nav aria-label="Page navigation">
                    <ul className={`ti-pagination justify-${justify} mb-${mb}`}>
                        <li className={`page-item ${currentPage <= 1 || paginationDisabled ? 'disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link px-3 py-[0.375rem]"
                                onClick={prevPage}
                                disabled={currentPage <= 1 || paginationDisabled}
                            >
                                Previous
                            </button>
                        </li>
                        {pages.map(page => (
                            <li className={`page-item ${paginationDisabled ? 'disabled' : ''}`} key={page}>
                                <button
                                    type="button"
                                    className={`page-link px-3 py-[0.375rem] ${page === currentPage ? 'active' : ''}`}
                                    onClick={() => gotoPage(page)}
                                    disabled={paginationDisabled}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage >= totalPages || paginationDisabled ? 'disabled' : ''}`}>
                            <button
                                type="button"
                                className="page-link px-3 py-[0.375rem]"
                                onClick={nextPage}
                                disabled={currentPage >= totalPages || paginationDisabled}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Pagination;
