import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import { useSelector } from "react-redux";
import Tooltip from "@components/Tooltip.jsx";

const HasProjectPermission = React.memo(({ globalPermission, children, users, needIcon = false }) => {
    const userId = useSelector((state) => state.auth.user?.id);  // Get current user ID from Redux state

    // Memoize the finding of the user to prevent recalculating on each render
    const projectUser = useMemo(() => users.find(user => user.id === userId), [users, userId]);

    // If the user has the `can_view_only` permission, do not render anything
    if (projectUser?.can_view_only) {
        if (needIcon){
            return (
                <span className="text-danger text-[1rem]">
                    <i className="ri-lock-line"></i>
                </span>
            )
        }
        return null;
    }

    // Check if the user has the global permission (e.g., "edit_project")
    const hasGlobalPermission = useHasPermission(globalPermission);

    // Otherwise, check if the user has the global permission
    return hasGlobalPermission ? children : null;
});

HasProjectPermission.propTypes = {
    globalPermission: PropTypes.string.isRequired,  // The global permission (e.g., "edit_project")
    children: PropTypes.node.isRequired,  // Children to render if the user has the necessary permissions
    users: PropTypes.array.isRequired,  // List of users with their permissions, including `can_view_only`
};

export default HasProjectPermission;
