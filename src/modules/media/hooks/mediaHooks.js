import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {getMediaFileById, getMediaFiles, uploadMediaFiles} from "@modules/media/services/MediaService.js";
import api from "@config/axiosConfig.js";
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

export const useSecureMedia = (fileId, isOpen) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [mimeType, setMimeType] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !fileId) return;

        let isMounted = true;
        setLoading(true);
        api.post(
            "/media/stream/",
            { id: fileId },
            { responseType: "blob" }
        )
            .then((response) => {
                if (!isMounted) return;

                const mimeType = response.headers["content-type"];
                const url = URL.createObjectURL(response.data);
                setBlobUrl(url);
                setMimeType(mimeType);
            })
            .catch((err) => {
                console.error("Failed to stream media:", err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                setBlobUrl(null);
                setMimeType("");
            }
        };
    }, [fileId, isOpen]);

    return { blobUrl, mimeType, loading };
};