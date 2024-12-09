import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {getMediaFileById, getMediaFiles, uploadMediaFiles} from "@modules/media/services/MediaService.js";

export const useMediaFiles = (page = 1, size = 8, search, type) => {
    return useQuery({
        queryKey: ['mediaFiles', page, size, search, type],
        queryFn: () => getMediaFiles(page, size, search, type),
        keepPreviousData: false,
        staleTime:0
    });
};



export const useMediaFile = (id) => {
    const [mediaFileData, setMediaFileData] = useState(null);

    useEffect(() => {
        const fetchMediaFile = async () => {
            try {
                const data = await getMediaFileById(id);
                setMediaFileData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchMediaFile();
    }, [id]);

    return { mediaFileData };
};

export const useMediaFileUpload = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFiles = async (files) => {
        setUploading(true);
        try {
            return await uploadMediaFiles(files)
        } catch (error) {
            console.error("Error uploading files:", error.message);
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadFiles,
        uploading,
    };
};