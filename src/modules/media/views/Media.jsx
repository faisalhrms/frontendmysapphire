import React from "react";
import MediaList from "@modules/media/components/MediaList.jsx";
import {Image} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const Media = () => {
    return(
        <>
            <IconPageHeader
                heading="Media Management"
                description="Organize and manage your media files and assets"
                icon={Image}
            />
            <MediaList />
        </>
    )
}

export default Media