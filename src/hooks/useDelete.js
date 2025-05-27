import {useDispatch} from 'react-redux';
import {showModal} from "@redux/common/delModalSlice.js";

export const useDelete = () => {
    const dispatch = useDispatch();

    const handleDeleteClick = (endpoint, itemName = '', refetch = null, params = {}) => {
        dispatch(showModal({endpoint, itemName, refetch,params}));
    }

    return {
        handleDeleteClick
    }
};
