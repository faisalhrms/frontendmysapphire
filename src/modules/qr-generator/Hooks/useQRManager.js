import { useState } from 'react';

const useQRManager = () => {
    const [qrCodes, setQrCodes] = useState([]);

    const addQRCode = (qrData) => {
        const newQR = {
            id: Date.now(),
            ...qrData,
            createdAt: new Date().toISOString(),
        };
        setQrCodes((prev) => [...prev, newQR]);
        return newQR;
    };

    const updateQRCode = (id, updatedData) => {
        setQrCodes((prev) =>
            prev.map((qr) => (qr.id === id ? { ...qr, ...updatedData } : qr))
        );
    };

    const deleteQRCode = (id) => {
        setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
    };

    const getQRCode = (id) => {
        return qrCodes.find((qr) => qr.id === id);
    };

    return {
        qrCodes,
        addQRCode,
        updateQRCode,
        deleteQRCode,
        getQRCode,
    };
};

export default useQRManager;