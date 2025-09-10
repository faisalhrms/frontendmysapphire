const ColorPicker = ({ label, color, onColorChange }) => (
    <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2"
            />
            <input
                type="text"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
        </div>
    </div>
);

const ColorSelector = ({ foregroundColor, backgroundColor, onForegroundChange, onBackgroundChange }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Foreground" color={foregroundColor} onColorChange={onForegroundChange} />
            <ColorPicker label="Background" color={backgroundColor} onColorChange={onBackgroundChange} />
        </div>
    </div>
);

export default ColorSelector;