import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isVisible: false,
    apiEndpoint: '',
    itemName: '',
    refetch: null,
};

const delModalSlice = createSlice({
    name: 'delModal',
    initialState,
    reducers: {
        showModal: (state, action) => {
            state.isVisible = true;
            state.apiEndpoint = action.payload.endpoint;
            state.itemName = action.payload.itemName;
            state.refetch = action.payload.refetch;
            setTimeout(() => {
                const modal = document.getElementById("delete-modal");
                if (modal) {
                    window.HSOverlay.open(modal);
                    modal.classList.add('open');
                }
            });
        },
        hideModal: (state) => {
            const modal = document.getElementById("delete-modal");
            if (modal) {
                window.HSOverlay.close(modal);
            }
            state.apiEndpoint = '';
            state.itemName = '';
            state.refetch = null
        },
        setModalVisible: (state, action) => {
            state.isVisible = action.payload;
        }
    }
});

export const { showModal, hideModal, setModalVisible } = delModalSlice.actions;
export default delModalSlice.reducer;
