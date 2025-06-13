import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FormInput from "@components/form/FormInput.jsx";
import { useForm, Controller } from "react-hook-form";

import { FaCamera } from "react-icons/fa";

const ScanBarcdeForm = () => {
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
                    setValue("scan", decodedText);
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
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-20 text-black flex flex-col items-center">
            <div className="xl:col-span-4 col-span-4">
                <div className="box shadow-lg rounded-lg bg-white p-4">
                    <div className="flex justify-center items-center bg-[#4d5875] rounded-lg mb-4"
                         style={{
                             height: "300px",
                             transition: "all 0.3s",
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                         }}
                    >
                        <div
                            id="reader"

                            style={{
                                width: scanning ? "100%" : "0",
                                height: scanning ? "100%" : "0",
                                transition: "all 0.3s",

                            }}
                        ></div>

                        {!scanning && (
                            <button
                                onClick={handleScanClick}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-white shadow-md border-2 border-gray-300 hover:border-gray-400 transition duration-300 ease-in-out"
                                title={scanning ? "Stop Scanning" : "Scan Barcode"}
                                type="button"
                            >
                                <FaCamera className="w-6 h-6"/>
                            </button>
                        )}
                    </div>
                    {/*<div className="p-4 w-full max-w-md mx-auto">*/}
                    {/*    <label htmlFor="scan" className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*        Scan or type barcode*/}
                    {/*    </label>*/}
                    {/*    <div className="flex items-center">*/}
                    {/*        <FormInput*/}
                    {/*            is_required={true}*/}
                    {/*            name="scan"*/}
                    {/*            control={control}*/}
                    {/*            errors={errors}*/}
                    {/*            onKeyDown={(e) => {*/}
                    {/*                if (e.key === "Enter") {*/}
                    {/*                    e.preventDefault();*/}
                    {/*                    handleSubmit(onSubmit)();*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*            className="pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out flex-grow mr-4"*/}
                    {/*        />*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={() => handleSubmit(onSubmit)()}*/}
                    {/*            className="ti-btn ti-btn-primary  !mb-0 ml-4"*/}
                    {/*        >*/}
                    {/*            Submit*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    <div className="p-4 w-full max-w-md mx-auto">
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
                            className="pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 ease-in-out"
                        />

                    </div>
                </div>
            </div>

        </form>
    );
};

export default ScanBarcdeForm;