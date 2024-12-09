import React from 'react';
import DataTable from '../../../components/DataTable';

const TaskGenerated = () => {

    const columns = [
        { Header: 'SR #', accessor: 'sr'},
        { Header: 'Task Type', accessor: 'taskType' },
        { Header: 'Task Title', accessor: 'taskTitle' },
        { Header: 'SR Time', accessor: 'srTime' },
        { Header: 'Requester Location', accessor: 'requesterLocation' },
        { Header: 'Requester', accessor: 'requester' },
        { Header: 'Assignee', accessor: 'assignee' },
        {
            Header: 'Action',
            accessor: 'ri-ICON_NAME"',
            Cell: ({ value }) => (
                <div className="flex space-x-2">
                    {value.includes('calendar') && (
                        <button className="text-green-500">
                            <i className="ri-eye-line"></i>
                        </button>
                    )}
                   
                </div>
            ),
            
        }
    ];
    
    return (
      
        <div>
            <br></br>
            
            <DataTable
                columns={columns}
                // apiUrl="/api/sr-management" 
                  title="SR Management"
                buttons={<button className="btn btn-primary">Add New</button>}  
            />
        </div>
    );
};

export default TaskGenerated;






