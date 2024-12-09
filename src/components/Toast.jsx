import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import {useSelector} from "react-redux";

const Toast = () => {
    const theme = useSelector((state) => state.theme);
    return(
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme.class}
            />
        </>
    )
}

export default Toast;