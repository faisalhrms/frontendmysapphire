import React from 'react';
import { Link } from 'react-router-dom';

const BrandBookLink = ({ to, title = "BrandBook" }) => {
    return (
        <div className="header-element header-brandbook py-[1rem] md:px-[0.65rem] px-2">
            <Link
                to={to}
                aria-label="anchor"
                className="inline-flex flex-shrink-0 justify-center items-center gap-2 !rounded-full font-medium dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10 relative group"
                title={title}
            >
                {/* Animated glow rings - continuous animation */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500" style={{ animationDuration: '3s' }}></span>
                <span className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-gradient-to-r from-indigo-400 to-sky-400" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></span>

                {/* Sparkle effect - continuous pulse */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }}></span>

                {/* Book icon with proper boxicon class */}
                <i className="bx bx-book-open header-link-icon relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-500 dark:group-hover:text-sky-400"></i>

                {/* Additional hover glow */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></span>
            </Link>
        </div>
    );
};

export default BrandBookLink;