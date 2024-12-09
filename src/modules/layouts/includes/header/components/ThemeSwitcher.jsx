const ThemeSwitcher = () => {
    return (
        <>
            <div className="header-element md:px-[0.48rem]">
                <button aria-label="button" type="button"
                        className="hs-dropdown-toggle switcher-icon inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium  align-middle transition-all text-xs dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                        data-hs-overlay="#hs-overlay-switcher">
                    <i className="bx bx-cog header-link-icon animate-spin-slow"></i>
                </button>
            </div>
        </>
    )
}

export default ThemeSwitcher