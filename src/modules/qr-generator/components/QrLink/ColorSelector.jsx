import React from "react";

const ColorPicker = ({ label, color, onColorChange }) => (
    <div className="flex items-center gap-3">
        <span className="text-[0.875rem] mb-1 font-semibold">{label}:</span>

        <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="form-control w-full !rounded-sm border-gray  form-control-color !border-0 block dark:text-gray-200 dark:bg-bodybg"
        />

        <input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-28 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm dark:text-gray-200 dark:bg-bodybg"
        />
    </div>
);

const ColorSelector = ({
                           foregroundColor,
                           backgroundColor,
                           onForegroundChange,
                           onBackgroundChange,
                       }) => {
    const handleTransparentToggle = (checked) => {
        if (checked) {

            onForegroundChange("#000000");
            onBackgroundChange("#ffffff");
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200 dark:bg-bodybg">Background
                    Color</h3>

                <div
                    className="bg-white  max-w-4xl w-full flex items-center gap-8 dark:text-gray-200 dark:bg-bodybg" >
                    <ColorPicker
                        label="Foreground"
                        color={foregroundColor}
                        onColorChange={onForegroundChange}
                    />
                    <ColorPicker
                        label="Background"
                        color={backgroundColor}
                        onColorChange={onBackgroundChange}
                    />


                    <label className="flex items-center gap-1 text-[0.875rem] mb-1 font-semibold ">
                        <input
                            type="checkbox"
                            onChange={(e) => handleTransparentToggle(e.target.checked)}
                        />
                        Transparent
                    </label>
                </div>
            </div>
        </div>
            );
            };

            export default ColorSelector;
