import Avatar from "@components/Avatar.jsx";
import {useState} from "react";

const UserFilter = () => {
    const [selectedPeople, setSelectedPeople] = useState([]);
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

    const togglePersonSelection = (person) => {
        if (isSelected(person.id)) {
            setSelectedPeople(selectedPeople.filter(p => p.id !== person.id));
        } else {
            setSelectedPeople([...selectedPeople, person]);
        }
    };

    const isSelected = (id) => {
        return selectedPeople.some(person => person.id === id);
    };

    const removePerson = (id) => {
        setSelectedPeople(selectedPeople.filter(person => person.id !== id));
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="ti-btn ti-btn-sm ti-btn-primary"
            >
                <i className='bx bx-user-circle'></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-8 xxl:col-span-3 xl:col-span-4 lg:col-span-4 justify-center z-[100]">
                    <div className="box">
                        <div className="box-body">
                            <h6 className="box-title font-semibold">Quick people filter</h6>
                            <p className="text-sm mb-4 text-gray-500">
                                Filter items and subitems by people
                            </p>
                            <div
                                className="grid gap-2 mb-4"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gridTemplateRows: "repeat(4)",
                                }}
                            >
                                {selectedPeople.map((person, index) => (
                                    <span
                                        key={person.id}
                                        className="flex items-center gap-1 px-3 py-1 ti-btn-primary text-blue-600 rounded-full text-sm"
                                        style={{
                                            gridColumn:
                                                index < 2
                                                    ? "span 1 / span 1"
                                                    : index < 5
                                                        ? "span 1 / span 1"
                                                        : "span 1 / span 1",
                                        }}
                                    >
                                        <Avatar
                                            avatar={null}
                                            parentClasses="mr-2"
                                            size="sm"
                                            shape="rounded"
                                        />
                                        {person.name}
                                        <button
                                            className="text-gray-500"
                                            onClick={() => removePerson(person.id)}
                                        >
                                            <i className="ri-close-circle-line"></i>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search people..."
                                className="form-control form-control-sm mb-4"
                            />
                            <div className="flex flex-wrap gap-2">
                                {filteredPeople.map((person) => (
                                    <div
                                        key={person.id}
                                        onClick={() => togglePersonSelection(person)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                                            isSelected(person.id)
                                                ? "bg-primary/10 text-primary ring-2 ring-primary"
                                                : "bg-bg-primary/10 text-primary"
                                        }`}
                                        title={person.name}
                                    >
                                        <Avatar
                                            avatar={null}
                                            size="sm"
                                            shape="rounded"
                                            classes="object-cover bg-bg-primary/10"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFilter;