import PerfectScrollbar from 'react-perfect-scrollbar';
import {toTitleCase} from "@helpers/formatters.js";
import {Avatar} from "@mui/material";

const TaskTeam = ({users}) => {
  return (
    <>
    <div className="box">
        <div className="box-header">
            <div className="box-title">
                Team Members
            </div>
        </div>
        <PerfectScrollbar className="box-body max-h-72">
            <ul className="list-none personal-favourite-contacts mb-0">
                {(
                    users.map(user => (
                        <li key={user.id}>
                            <div className="flex items-center">
                                <div className="me-2">
                                    <span className="avatar avatar-sm">
                                        <img src="/src/assets/images/faces/2.jpg" alt={user.full_name}/>

                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <span className="font-semibold">{toTitleCase(user.full_name)}</span>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </PerfectScrollbar>
    </div>
</>
  )
}

export default TaskTeam