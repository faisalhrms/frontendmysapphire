import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {hideModal, setModalVisible} from "@redux/common/delModalSlice.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import styles from "@css/custom/alert-modal.module.css";

const DeleteModal = () => {
    const {isVisible, apiEndpoint, itemName, refetch} = useSelector((state) => state.delModal);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!apiEndpoint) return;
        setLoading(true);
        try {
            const response = await api.delete(apiEndpoint);
            Notify.success(response.data.message);
            closeModal();
            if (refetch){
                refetch()
            }
        } catch (error) {
            Notify.error(error.response?.data?.message || 'Failed to delete');
            throw error
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        dispatch(hideModal());
        setTimeout( () => {
            dispatch(setModalVisible(false));
        }, 400)
    }

    if (!isVisible) return null;
    return (
        <div
            id="delete-modal"
            data-hs-overlay-keyboard="false"
            className='hs-overlay ti-modal hidden [--overlay-backdrop:static] backdrop-blur-[0.08rem]'>
            <div
                className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center" style={{ maxWidth: "max-content" }}>
                <div className="ti-modal-body min-w-[440px]">
                    <div className={styles.tiModalContent}>
                        <div className={`alert custom-alert1 alert-danger`}>
                            <button
                                aria-label="Close"
                                className="btn-close ms-auto"
                                type="button"
                                onClick={closeModal}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                            <div className="text-center px-5 pb-0">
                                <svg
                                    className={`custom-alert-icon svg-danger inline-flex`}
                                    fill="#000000"
                                    height="1.5rem"
                                    viewBox="0 0 24 24"
                                    width="1.5rem"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"/>
                                </svg>
                                <h3 className="!font-medium">Delete</h3>
                                <p>
                                    Are you sure you want to delete {itemName}?
                                </p>
                                <div>
                                    <button
                                        className={`ti-btn !py-1 !px-2 !text-[0.75rem] !font-medium bg-danger text-white m-1 ${loading ? "ti-btn-disabled" : ""}`}
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    aria-label="loading"
                                                    className="ti-spinner !w-[1rem] !h-[1rem] text-white"
                                                    role="status">
                                                </span>
                                                <span>Loading...</span>
                                            </>
                                        ) : <span> Delete </span>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
