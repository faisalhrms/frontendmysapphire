const PatternSelector = ({ patterns, selectedPattern, onSelect }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Body Patterns</h3>
        <div className="grid grid-cols-3 gap-3">
            {patterns.map((pattern) => (
                <button
                    key={pattern.id}
                    onClick={() => onSelect(pattern.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedPattern === pattern.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                    }`}
                >
                    <div className="text-2xl mb-2">{pattern.preview}</div>
                    <div className="text-xs font-medium">{pattern.name}</div>
                </button>
            ))}
        </div>
    </div>
);

export default PatternSelector;