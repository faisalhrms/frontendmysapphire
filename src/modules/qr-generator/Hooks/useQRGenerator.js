import QRCode from 'qrcode';

const useQRGenerator = () => {
    const generateQRDataURL = async (url, options = {}) => {
        try {
            const qrDataURL = await QRCode.toDataURL(url, {
                errorCorrectionLevel: options.errorCorrection || 'M',
                width: options.size || 200,
                margin: 2,
                color: {
                    dark: options.foregroundColor || '#000000',
                    light: options.backgroundColor || '#ffffff',
                },
            });
            return qrDataURL;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return null;
        }
    };

    const downloadQR = (dataURL, filename) => {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = dataURL;
        link.click();
    };

    return { generateQRDataURL, downloadQR };
};

export default useQRGenerator;