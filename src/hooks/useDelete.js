import {useDispatch} from 'react-redux';
import {showModal} from "@redux/common/delModalSlice.js";

export const useDelete = () => {
    const dispatch = useDispatch();

    const handleDeleteClick = (endpoint, itemName = '', refetch = null) => {
        dispatch(showModal({endpoint, itemName, refetch}));
    }

    return {
        handleDeleteClick
    }
};
