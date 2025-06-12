import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

const Card = ({ name, icon, color, onClick }) => {
    return (
        <div
            className={`bg-white flex flex-col items-center justify-center w-80 h-40 p-6 m-2 ${color} rounded-lg mb-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer dark:text-gray-200 dark:bg-bodybg`}
            onClick={onClick}
        >
            <img src={icon} alt={name} className="w-16 h-16 mb-2" />
            <h3 className="italic text-lg">{name}</h3>
        </div>
    );
};

const CardForm = () => {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const [barcode, setBarcode] = useState('');

    const handleScanClick = () => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                html5QrCode.stop().then(() => {
                    document.getElementById("reader").innerHTML = "";
                    setBarcode(decodedText); // Fill the scanned barcode
                    triggerSearch(decodedText); // Trigger search
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    };

    const triggerSearch = (code) => {
        console.log("Triggering search for barcode:", code);
        // Optional: Call API or perform logic here
    };

    return (
        <div className="mt-20 text-black flex flex-col items-center">
            <div className="flex flex-wrap justify-center">
                <Card
                    name="Scan Barcode"
                    icon="https://img.icons8.com/ios-filled/100/barcode-scanner.png"
                    color="bg-green-500"
                    onClick={handleScanClick}
                />
            </div>

            <div className="mt-6 w-80">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="barcode">
                    Scanned / Enter Barcode
                </label>
                <input
                    id="barcode"
                    type="text"
                    className="w-full px-4 py-2 border rounded shadow"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            triggerSearch(barcode);
                        }
                    }}
                    placeholder="Scan or type barcode"
                />
            </div>

            <div id="reader" className="mt-4" style={{ width: "300px" }}></div>
        </div>
    );
};

export default CardForm;
