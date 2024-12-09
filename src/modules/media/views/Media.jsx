import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import MediaList from "@modules/media/components/MediaList.jsx";

const Media = () => {
    return(
        <>
            <PageHeader currentpage="Media Management" />
            <MediaList />
        </>
    )
}

export default Media