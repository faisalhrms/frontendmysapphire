import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Notify from "@helpers/toastNotifications.js";
import api from "../config/axiosConfig.js";

const useDiscussion = (attachment_ids = [], clearAttachments, getEndPoint, storeEndPoint) => {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
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
            setSelectedUsers([]);
            setMessage("");
            clearAttachments();
        },
        onError: (error) => {
            Notify.error(error.response?.data?.message || "Failed to post discussion");
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });
    const handleSubmit = () => {
        if (!message.trim() && attachment_ids.length === 0 && selectedUsers.length === 0) {
            Notify.error("Message, attachment, or selected users are required to post a discussion.");
            return;
        }
        setIsSubmitting(true);
        const mentionsUserIds = selectedUsers.map(user => user.id);
        mutation.mutate({ message, attachment_ids, mentions: mentionsUserIds });
    };

    return {
        discussions,
        isLoading,
        message,
        setMessage,
        selectedUsers,
        setSelectedUsers,
        isSubmitting,
        handleSubmit,
        refetch,
    };
};

export default useDiscussion;
