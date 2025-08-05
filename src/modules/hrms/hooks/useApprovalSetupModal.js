import { useState, useCallback } from 'react';

const useDynamicDropdown = (initialDropdowns = []) => {
    const [dropdowns, setDropdowns] = useState(initialDropdowns.length ? initialDropdowns : [
        {
            id: 1,
            value: '',
            options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
                { value: 'option4', label: 'Option 4' },
            ],
        },
    ]);

    const users = [
        { id: '1', name: 'All People', email: 'all@team.com', avatar: 'http://127.0.0.1:8000/media/uploads/2025/01/09/kinza-sm.jpg' },
        { id: '2', name: 'kinza', email: 'sana@team.com', avatar: 'http://127.0.0.1:8000/media/uploads/2025/01/09/kinza-sm.jpg' },
        { id: '3', name: 'abc', email: 'yasir@team.com', avatar: '' },
    ];

    const addDropdown = useCallback(() => {
        const newDropdown = {
            id: Date.now(),
            value: '',
            options: [
                { value: 'sub1', label: 'Sub Option 1' },
                { value: 'sub2', label: 'Sub Option 2' },
                { value: 'sub3', label: 'Sub Option 3' },
                { value: 'sub4', label: 'Sub Option 4' },
            ],
        };
        setDropdowns((prev) => [...prev, newDropdown]);
    }, []);

    const removeDropdown = useCallback((id) => {
        setDropdowns((prev) => prev.filter((dropdown) => dropdown.id !== id));
    }, []);

    const updateDropdownValue = useCallback((id, value) => {
        setDropdowns((prev) =>
            prev.map((dropdown) =>
                dropdown.id === id ? { ...dropdown, value } : dropdown
            )
        );
    }, []);

    const moveItem = useCallback((fromIndex, toIndex) => {
        setDropdowns((prevItems) => {
            const updated = [...prevItems];
            const [movedItem] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, movedItem);
            return updated;
        });
    }, []);

    return {
        dropdowns,
        addDropdown,
        removeDropdown,
        updateDropdownValue,
        moveItem,
        users,
    };
};

export default useDynamicDropdown;