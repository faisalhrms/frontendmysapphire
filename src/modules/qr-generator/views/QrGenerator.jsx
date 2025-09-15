import QRCodeGenerator from "@modules/qr-generator/components/QrLink/QRCodeGenerator.jsx";

import {FolderPlus, Pyramid ,QrCode} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const QrGenerator = () => {
    return (
        <div>

            <IconPageHeader
                heading="QR Generator"
                description="Create and customize your QR codes easily by filling out the details below."
                icon={QrCode}
            />
            <QRCodeGenerator />
        </div>
    );
};

export default QrGenerator;