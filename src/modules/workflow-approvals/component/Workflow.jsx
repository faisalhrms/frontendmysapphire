import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../../../components/form/FormButton.jsx";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@assets/css/custom/hierarchy.css';
import Notify from "@helpers/toastNotifications.js";
import DraggableItem from './DraggableItem.jsx';
import workflowSchemas from "@modules/workflow-approvals/schemas/WorkflowSchemas.js";

const Workflow = (props) => {
    const { control, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm({
        resolver: zodResolver(workflowSchemas),
        defaultValues: {
            workflows: [{ id: Date.now(), user_id: undefined, position: 1, type: 'subscription' }]
        }
    });

    const [currentWorkflows, setCurrentWorkflows] = useState(getValues("workflows"));

    useEffect(() => {
        const subscription = watch((value) => {
            setCurrentWorkflows(value.workflows);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const updateAllIDs = (workflows) => {
        return workflows.map((item, index) => ({
            ...item,
            id: item.id || Date.now() + index
        }));
    };

    const addItem = () => {
        const newItem = { id: Date.now(), user_id: undefined, position: currentWorkflows.length + 1, type: 'subscription' };
        const updatedWorkflows = [...currentWorkflows, newItem];
        const workflowsWithUpdatedIDs = updateAllIDs(updatedWorkflows);
        setValue("workflows", workflowsWithUpdatedIDs);
        setCurrentWorkflows(workflowsWithUpdatedIDs);
    };

    const removeItem = (id) => {
        const updatedWorkflows = currentWorkflows.filter(item => item.id !== id);
        const workflowsWithUpdatedIDs = updateAllIDs(updatedWorkflows.map((item, index) => ({
            ...item,
            position: index + 1,
        })));
        setValue("workflows", workflowsWithUpdatedIDs);
        setCurrentWorkflows(workflowsWithUpdatedIDs);
    };

    const moveItem = useCallback((fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
    
        setCurrentWorkflows((prevWorkflows) => {
            const updatedWorkflows = [...prevWorkflows];
            const [movedItem] = updatedWorkflows.splice(fromIndex, 1);
            updatedWorkflows.splice(toIndex, 0, movedItem);
    
           
            const workflowsWithUpdatedPositions = updatedWorkflows.map((item, index) => ({
                ...item,
                position: index + 1,
            }));
    
            setValue("workflows", workflowsWithUpdatedPositions);
            return workflowsWithUpdatedPositions;
        });
    }, [setValue]);
    
    

    const onSubmit = () => {
        Notify.success('Data Submit');
       
        const data = getValues("workflows");
        console.log(data);
    };
return (
        <DndProvider backend={HTML5Backend}>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="hierarchy-list flex justify-center" id="draggable-left">
                    <div className="box box-hierarchy border border-solid border-gray-300 rounded-lg shadow-md bg-white w-full max-w-[700px]">
                        <div className="box-body p-8">
                            <div className="grid grid-cols-12 gap-y-4">
                                {currentWorkflows.map((item, index) => (
                                  
                                    <DraggableItem
                                        key={item.id}
                                        item={{ ...item, preselectedOptions: props.preselectedOptions }}
                                        index={index}
                                        control={control}
                                        errors={errors}
                                        addItem={addItem}
                                        removeItem={removeItem}
                                        moveItem={moveItem}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="footer-hierarchy flex justify-end p-5 border-t border-dashed border-gray-300">
                            <FormButton type="submit" />
                        </div>
                    </div>
                </div>
            </form>
        </DndProvider>
      
    );
    
};

export default Workflow;
