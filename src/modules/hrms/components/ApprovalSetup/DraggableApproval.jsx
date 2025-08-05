import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Plus, Minus } from 'lucide-react';

const ItemType = 'DROPDOWN';

const DraggableDropdown = ({
                               id,
                               index,
                               moveItem,
                               dropdown,
                               updateDropdownValue,
                               addDropdown,
                               removeDropdown,
                               isLast,
                               canRemove,
                               users,
                           }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const dragDropRef = (node) => {
        ref.current = node;
        drag(node);
        drop(node);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <tr
            ref={dragDropRef}
            className={`border border-gray-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >

            <td className="py-3 px-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue text-white rounded-full text-sm font-semibold">
                    {index + 1}
                </span>
            </td>
            <td className="py-3 px-4 w-full">
                <div className="relative">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
                    >
                        {dropdown.value || 'Select '}
                    </div>
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <div className="p-2">
                                <input
                                    type="text"
                                    placeholder="Enter person to search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-control form-control-sm w-full"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                {filteredUsers?.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            updateDropdownValue(dropdown.id, user.name);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <img
                                            src={user?.avatar}
                                            alt={user?.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div>
                                            <div>{user?.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-sm text-gray-500 p-2">
                                    {users?.length} team members available
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                    {isLast && (
                        <button
                            onClick={addDropdown}
                            className="w-10 h-10 bg-success text-white rounded-full hover:bg-success transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            title="Add next level"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                    {canRemove && (
                        <button
                            onClick={() => removeDropdown(dropdown.id)}
                            className="w-10 h-10 bg-red text-white rounded-full hover:bg-red transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            title="Remove this level"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default DraggableDropdown;
