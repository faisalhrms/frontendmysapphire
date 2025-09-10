const ContentTypeSelector = ({ contentTypes, selectedType, onSelect }) => (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
                <button
                    key={type.id}
                    onClick={() => onSelect(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        type.id === selectedType
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                    }`}
                >
                    <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                            type.id === selectedType ? 'text-purple-600' : 'text-gray-400'
                        }`}
                    />
                    <div className="text-xs font-medium">{type.label}</div>
                </button>
            );
        })}
    </div>
);

export default ContentTypeSelector;