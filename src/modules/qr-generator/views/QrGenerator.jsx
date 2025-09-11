import QRCodeGenerator from "@modules/qr-generator/components/QrLink/QRCodeGenerator.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Pyramid} from "lucide-react";

const QrGenerator = () => {
    return (
        <div>
            <IconPageHeader
                title="QR Code Generator"
                description="Create custom QR codes with advanced styling options"
                icon={Pyramid}
            />
            <QRCodeGenerator />
        </div>
    );
};

export default QrGenerator;