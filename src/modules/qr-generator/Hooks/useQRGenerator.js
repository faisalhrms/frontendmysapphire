import QRCodeStyling from 'qr-code-styling';

const useQRGenerator = () => {
    const generateQRDataURL = async (url, options = {}) => {
        try {
            const getPatternConfig = (pattern) => {
                switch (pattern) {
                    case 'circle':
                        return { type: 'dots' };
                    case 'rounded':
                        return { type: 'rounded' };
                    case 'square':
                    default:
                        return { type: 'square' };
                }
            };

            const qrCode = new QRCodeStyling({
                width: options.size || 200,
                height: options.size || 200,
                type: options.type || 'png',
                data: url,
                dotsOptions: {
                    color: options.foregroundColor || '#000000',
                    ...getPatternConfig(options.pattern)
                },
                backgroundOptions: {
                    color: options.backgroundColor || '#ffffff',
                },
                cornersSquareOptions: {
                    color: options.foregroundColor || '#000000',
                    ...getPatternConfig(options.pattern)
                },
                cornersDotOptions: {
                    color: options.foregroundColor || '#000000',
                    ...getPatternConfig(options.pattern)
                },
                qrOptions: {
                    errorCorrectionLevel: options.errorCorrection || 'M'
                }
            });

            return new Promise((resolve) => {
                qrCode.getRawData('png').then((buffer) => {
                    const blob = new Blob([buffer], { type: 'image/png' });
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            return null;
        }
    };

    const downloadQR = (dataURL, filename, format = 'png') => {
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = dataURL;
        link.click();
    };

    return { generateQRDataURL, downloadQR };
};

export default useQRGenerator;