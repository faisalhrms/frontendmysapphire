import React, { useState, useEffect, useRef } from "react";
import AvatarList from "@components/AvatarList.jsx";
import Avatar from "@components/Avatar.jsx";

const allPeople = [
    { id: "AM", full_name: "Abdul Mannan", avatar:null },
    { id: "AN", full_name: "Ayesha Noor", avatar: null },
    { id: "AM2", full_name: "Ali Mirza", avatar: null },
    { id: "DA", full_name: "Danish Ahmed", avatar:null},
    { id: "HS", full_name: "Harris Saeed", avatar: null },
    { id: "HN", full_name: "Hira Noreen", avatar: null },
    { id: "KJ", full_name: "Kiran Javed", avatar: null },
    { id: "MA", full_name: "Mahnoor Ali", avatar: null },
    { id: "MM", full_name: "Maliha Memon", avatar: null },
    { id: "NJ", full_name: "Nermeen Jacob", avatar: null },
    { id: "SK", full_name: "Shamroz Khan", avatar: null },
    { id: "ZT", full_name: "Zohaib Tariq", avatar: null },
    { id: "RT", full_name: "Rafay Tariq", avatar: null },
    { id: "FA", full_name: "Fatima Aslam", avatar: null },
    { id: "SM", full_name: "Sami Malik", avatar: null },
    { id: "RA", full_name: "Rameen Ahmed", avatar: null },
    { id: "UJ", full_name: "Usman Javed", avatar: null },
    { id: "NB", full_name: "Noman Bashir", avatar: null },
    { id: "FS", full_name: "Farhan Siddiqui", avatar: null },
    { id: "KS", full_name: "Kamran Shahid", avatar: null },
    { id: "LQ", full_name: "Laiba Qureshi", avatar: null },
    { id: "AJ", full_name: "Ahmed Jamil", avatar: null },
];

const PeopleFilter = ({ onClose }) => {
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const togglePersonSelection = (person) => {
        setSelectedPeople((prev) =>
            prev.some((p) => p.id === person.id)
                ? prev.filter((p) => p.id !== person.id)
                : [...prev, person]
        );
    };

    const filteredPeople = allPeople.filter((person) =>
        person.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const maxVisibleUsers = 20;
    const hiddenUsersCount = filteredPeople.length > maxVisibleUsers ? filteredPeople.length - maxVisibleUsers : 0;

    return (
        <div ref={filterRef} className="absolute right-0 mt-2 w-80 bg-white shadow-lg p-4 rounded-lg z-50">
            <h6 className="font-semibold mb-1">Quick people filter</h6>
            <p className="text-sm text-gray-500 mb-3">Filter items and subitems by people</p>

            {/* Selected People Section */}
            {selectedPeople.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {selectedPeople.map((person) => (
                        <div key={person.id} className="flex items-center bg-gray-200 px-2 py-1 rounded-full">
                            <Avatar avatar={person.avatar} size="xs" shape="rounded" />
                            <span className="ml-2 text-sm">{person.full_name}</span>
                            <button
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                onClick={() => togglePersonSelection(person)}
                            >
                                <i className="ti ti-x"></i> {/* Close (X) icon */}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <i className="ti ti-user absolute right-3 top-2.5 text-gray-400"></i> {/* User Icon */}
            </div>

            {/* People List (Below Search) */}
            <div className="flex flex-wrap gap-3">
                {filteredPeople.slice(0, maxVisibleUsers).map((person) => (
                    <button
                        key={person.id}
                        onClick={() => togglePersonSelection(person)}
                        className={`relative flex items-center justify-center transition ${
                            selectedPeople.some((p) => p.id === person.id) ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-gray-300"
                        }`}
                    >
                        <Avatar avatar={person.avatar} size="sm" shape="rounded" />
                    </button>
                ))}
                {hiddenUsersCount > 0 && (
                    <div className="avatar bg-primary text-white text-xs font-semibold w-8 h-8 flex items-center justify-center rounded-full">
                        +{hiddenUsersCount}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeopleFilter;
