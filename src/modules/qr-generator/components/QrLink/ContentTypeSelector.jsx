const ContentTypeSelector = ({ contentTypes, selectedType, onSelect }) => (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-6">
        {contentTypes.map((type) => {
            const isActive = type.id === selectedType;
            const isImage = typeof type.icon === "string";

            return (
                <button
                    key={type.id}
                    onClick={() => onSelect(type.id)}
                    className={`w-full sm:w-auto py-3 px-4 flex flex-col items-center rounded-lg transition-colors dark:text-gray-200 dark:bg-bodybg
            ${
                        isActive
                            ? "bg-primary/20 border border-primary font-semibold"
                            : "bg-white border border-gray-200 hover:border-primary"
                    }`}
                >
                    {isImage ? (
                        <img
                            src={type.icon}
                            alt={type.label}
                            className="h-7 w-7 mb-1 object-contain "
                        />
                    ) : (
                        <type.icon className={`h-7 w-7 mb-1   ${type.color || ""}`} />
                    )}

                    <span
                        className={`text-sm ${
                            isActive ? "text-primary font-semibold" : "text-gray-600"
                        }`}
                    >
            {type.label}
          </span>
                </button>
            );
        })}
    </div>
);

export default ContentTypeSelector;
