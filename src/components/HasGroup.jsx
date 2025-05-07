import PropTypes from "prop-types";
import {useHasGroup} from "@modules/auth/hooks/authHooks.js";

const HasGroup = ({ group, children }) => {
    return useHasGroup(group) ? children : null
}
HasGroup.propTypes = {
    group: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default HasGroup;