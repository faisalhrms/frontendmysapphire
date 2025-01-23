


import React, { useState } from "react";

const PeopleFilter = () => {
    const [selectedPeople, setSelectedPeople] = useState([
        { id: "FN", name: "Fatima Nauman" },
        { id: "HS", name: "Harris Saeed" },
        { id: "HN", name: "Hira Noreen" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const allPeople = [
        { id: "FN", name: "Fatima Nauman" },
        { id: "HS", name: "Harris Saeed" },
        { id: "HN", name: "Hira Noreen" },
        { id: "MA", name: "Mahnoor Ali" },
        { id: "MM", name: "Maliha Memon" },
        { id: "NJ", name: "Nermeen Jacob" },
        { id: "SK", name: "Shamroz Khan" },
    ];

    const filteredPeople = allPeople.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const removePerson = (id) => {
        setSelectedPeople(selectedPeople.filter((person) => person.id !== id));
    };

    const addPerson = (person) => {
        if (!selectedPeople.find(p => p.id === person.id)) {
            setSelectedPeople([...selectedPeople, person]);
        }
    };

    const isSelected = (id) => {
        return selectedPeople.some(person => person.id === id);
    };

    return (
        <div className="relative">
            {/* Icon to toggle dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 bg-sucess rounded-full bg-gray"
            >
                <box-icon name="dots-vertical-rounded"></box-icon>
            </button>

            {isOpen && (
                <div className="absolute w-96 bg-white border shadow-md rounded-md p-4">
                    <h3 className="font-semibold mb-2 text-lg">Quick people filter</h3>
                    <p className="text-sm mb-4 text-gray-500">
                        Filter items and subitems by people
                    </p>

                    {/* Selected People Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPeople.map((person) => (
                            <span
                                key={person.id}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                            >
                                {person.name}
                                <button
                                    className="text-gray-500 text-success"
                                    onClick={() => removePerson(person.id)}
                                >
                                    ✖
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search people..."
                        className="w-full border rounded-md p-2 mb-4"
                    />

                    {/* People List */}
                    <div className="flex flex-wrap gap-2">
                        {filteredPeople.map((person) => (
                            <div
                                key={person.id}
                                onClick={() => addPerson(person)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                                    isSelected(person.id)
                                        ? 'bg-success text-white'
                                        : 'bg-black text-blue-600 bg-success'
                                }`}
                                title={person.name}
                            >
                                {person.id}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeopleFilter;
