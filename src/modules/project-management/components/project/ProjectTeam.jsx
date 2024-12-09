import PerfectScrollbar from 'react-perfect-scrollbar';
import {toTitleCase} from "@helpers/formatters.js";
import Avatar from "@components/Avatar.jsx";

const ProjectTeam = ({users}) => {
    return(
        <>
            <div className="box">
                <div className="box-header">
                    <div className="box-title">
                        Team Members <span className="badge bg-primary/10 !rounded-full text-primary ms-1">{ users.length }</span>
                    </div>
                </div>
                <PerfectScrollbar className="box-body max-h-72">
                    <ul className="list-none personal-favourite-contacts mb-0">
                        {(
                            users.map(user => (
                                <li key={user.id}>
                                    <div className="flex items-center">
                                        <div className="me-2">
                                            <Avatar avatar={user.avatar} />
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

export default ProjectTeam;