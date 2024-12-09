import React from 'react';
import FormAsyncSelect from "../../../components/form/FormAsyncSelect.jsx";
import HiddenFormInput from "@components/form/HiddenFormInput.jsx";
import {useDrag, useDrop } from 'react-dnd';
const ItemType = 'ITEM';
const DraggableItem =({ item, index, control, errors, addItem, removeItem, moveItem })=> {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index; 
            }
        },
    });

    return (
      <>
       <div ref={(node) => drag(drop(node))} className={`xl:col-span-12 col-span-12 box-anchor" ${isDragging ? 'opacity-50' : ''}`}>
            <div className="draggable-item flex items-center justify-between border border-primary p-5 rounded-lg shadow-md bg-white w-full mb-4">
                <div className="item-position flex items-center justify-center bg-primary text-white w-8 h-8 rounded-full mr-4">
                    {index + 1}
                    <HiddenFormInput name={`workflows.${index}.position`} control={control} errors={errors} value={index + 1} valueType="number" />
                </div>
                <div className="item-select flex-1">
                    <FormAsyncSelect
                        label={false}
                        name={`workflows.${index}.user_id`}
                        control={control}
                        errors={errors}
                        placeholder="Select user"
                        apiUrl="/select/users"
                        queryKeyBase="users"
                        preselectedOptions={item.preselectedOptions || []}
                    />
                </div>
                <HiddenFormInput name={`workflows.${index}.type`} control={control} errors={errors} value="subscription" />
                <div className="item-buttons flex items-center justify-between space-x-3">
                    <button type="button" onClick={addItem} className="add-button text-2xl">
                        <i className="bi bi-plus-square text-success"></i>
                    </button>
                    {index !== 0 && (
                        <button type="button" onClick={() => removeItem(item.id)} className="remove-button text-2xl">
                            <i className="bi bi-dash-square text-danger"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
      
      </>
    );
}

export default DraggableItem;
