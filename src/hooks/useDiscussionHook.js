import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Notify from "@helpers/toastNotifications.js";
import api from "../config/axiosConfig.js";

const useDiscussion = (attachment_ids = [], clearAttachments, getEndPoint, storeEndPoint) => {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: discussions = [], isLoading,refetch } = useQuery({
        queryKey: [getEndPoint],
        queryFn: () => api.get(getEndPoint).then((res) => res.data.data),
        enabled: !!getEndPoint,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
    const mutation = useMutation({
        mutationFn: (payload) => api.post(storeEndPoint, payload).then((res) => res.data.data),
        onSuccess: (newDiscussion) => {
            queryClient.setQueryData([getEndPoint], (oldDiscussions) => {
                const discussionsArray = oldDiscussions && Array.isArray(oldDiscussions) ? oldDiscussions : [];
                return [...discussionsArray, newDiscussion];
            });
            Notify.success('Discussion posted successfully');
            setMessage("");
            clearAttachments();
        },
        onError: (error) => {
            console.log(`this is error`,error)
            Notify.error(error.response?.data?.message || "Failed to post discussion");
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });
    const handleSubmit = () => {
        if (!message.trim() && attachment_ids.length === 0) {
            Notify.error("Message or attachment is required to post a discussion.");
            return;
        }
        setIsSubmitting(true);
        mutation.mutate({ message, attachment_ids });
    };

    return {
        discussions,
        isLoading,
        message,
        setMessage,
        isSubmitting,
        handleSubmit,
        refetch,
    };
};

export default useDiscussion;
