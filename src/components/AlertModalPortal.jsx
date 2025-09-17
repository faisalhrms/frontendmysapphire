import ReactDOM from 'react-dom';
import AlertModal from "@components/AlertModal.jsx";

const AlertModalPortal = ({
                              id,
                              isOpen,
                              type,
                              title,
                              message,
                              btnTxt,
                              isSubmitting,
                              needInput,
                              inputLabel,
                              onConfirm,
                              onClose
                          }) => {
    if (!document.getElementById('modal-root')) return null;

    return ReactDOM.createPortal(
        <AlertModal
            id={id}
            isOpen={isOpen}
            type={type}
            title={title}
            message={message}
            btnTxt={btnTxt}
            isSubmitting={isSubmitting}
            needInput={needInput}
            inputLabel={inputLabel}
            onConfirm={onConfirm}
            onClose={onClose}
        />,
        document.getElementById('modal-root')
    );
};

export default AlertModalPortal;
