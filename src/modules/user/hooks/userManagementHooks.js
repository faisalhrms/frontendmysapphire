// useUserManagement.js
import { useState, useEffect } from 'react';
import { getUsers } from "@modules/user/services/userManagementService.js";

export const useUserManagement = (pageSize = 10) => {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(pageSize);
    const [search, setSearch] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // Fetch user data from the API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getUsers(page, size, search);
                setUserData(data.data);
                setTotalCount(data.total_count);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [page, size, search]);

    // Handle the search input
    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1); // Reset to the first page
    };

    return {
        userData,
        isLoading,
        page,
        setPage,
        size,
        setSize,
        handleSearch,
        totalCount
    };
};
