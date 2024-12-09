import PropTypes from "prop-types";
import {useHasPermission} from "@modules/auth/hooks/authHooks.js";

const HasPermission = ({ permission, children }) => {
    return useHasPermission(permission) ? children : null
}
HasPermission.propTypes = {
    permission: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default HasPermission;