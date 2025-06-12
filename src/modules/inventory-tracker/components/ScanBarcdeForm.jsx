import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx"; // Adjust the path if needed
import { useForm, Controller } from "react-hook-form";
import { FaBarcode } from "react-icons/fa";

const CardForm = () => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);

    const handleScanClick = () => {
        if (scanning) {
            scannerRef.current?.stop().then(() => {
                document.getElementById("reader").innerHTML = "";
                setScanning(false);
            });
            return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        setScanning(true);

        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                html5QrCode.stop().then(() => {
                    document.getElementById("reader").innerHTML = "";
                    setValue("scan", decodedText); // Set value in the form
                    setScanning(false);
                    console.log("Scanned barcode:", decodedText);
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    };

    const onSubmit = (data) => {
        console.log("Submitted barcode:", data.scan);
        // You can trigger your search or API here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-20 text-black flex flex-col items-center">
            <div className="mt-6 w-80 relative">
                <FormInput
                    is_required={true}
                    name="scan"
                    control={control}
                    errors={errors}
                    placeholder="Scan or type barcode"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit(onSubmit)();
                        }
                    }}
                    className="pr-10"
                />

                <button
                    onClick={handleScanClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
                    title={scanning ? "Stop Scanning" : "Scan Barcode"}
                    type="button"
                >
                    <FaBarcode className="w-5 h-5" />
                </button>
            </div>

            <div
                id="reader"
                className="mt-4"
                style={{
                    width: scanning ? "300px" : "0",
                    height: scanning ? "300px" : "0",
                    transition: "all 0.3s",
                }}
            ></div>
        </form>
    );
};

export default CardForm;
