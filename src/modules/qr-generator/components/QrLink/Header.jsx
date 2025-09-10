import { ArrowLeft } from 'lucide-react';

const Header = ({ title, subtitle, onBack, showBack = false }) => (
    <div className="flex items-center gap-4 mb-6">
        {showBack && (
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm border hover:bg-primary"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
        )}
        <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export default Header;