import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Plus, Minus } from 'lucide-react';
import UserDropdown from "@components/dropdowns/UserDropdown.jsx";

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
