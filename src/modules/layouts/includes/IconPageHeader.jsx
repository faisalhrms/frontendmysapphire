import { Package } from "lucide-react";

const IconPageHeader = ({
                            heading = "Default Heading",
                            description = "Default description",
                            icon: IconComponent = Package,
                            children = null
                        }) => {
    return (
        <div className="block justify-between page-header border-b border-slate-200 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <IconComponent className="w-8 h-8 text-slate-700 mr-3"/>
                    <div>
                        <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-[1.125rem] font-semibold">
                            {heading}
                        </h3>
                        <div className="text-sm text-slate-600">{description}</div>
                    </div>
                </div>
                    {children}
                </div>
            </div>
            );
            };

            export default IconPageHeader;
