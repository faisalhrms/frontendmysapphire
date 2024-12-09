import {useEffect, useState} from "react";
import debounce from "lodash.debounce";

export const useSearchHook = (initialPage = 1) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(initialPage);

    const debouncedSearchTerm = debounce((term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }, 300);

    const handleSearchChange = (e) => {
        debouncedSearchTerm(e.target.value);
    };

    useEffect(() => {
        return () => {
            debouncedSearchTerm.cancel();
        };
    }, [debouncedSearchTerm]);

    return {
        searchTerm,
        currentPage,
        setCurrentPage,
        handleSearchChange,
    };
};