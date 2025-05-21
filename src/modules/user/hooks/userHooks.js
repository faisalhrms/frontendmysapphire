import {useNavigate} from "react-router-dom";
import {createOtherUser, createUser, getUserById, updateUser} from "@modules/user/services/userService.js";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {otherUserCreateSchema} from "@modules/user/schemas/otherUserSchema.js";

export const useUserForm = (userData) => {

    const navigate = useNavigate();

    const handleUserSubmit = async (data) => {

        try {
            if (userData) {
                await updateUser(userData.id, data);
            } else {
                await createUser(data);
            }
            navigate('/module/users');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleUserSubmit };
};

export const useUser = (id) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUser();
    }, [id]);

    return { userData };
}

export const useOtherUserModal = () => {
    const [isUserModalOpen, setIsModalOpen] = useState(false);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(otherUserCreateSchema),
    });

    const openUserModal = () => {
        reset({
            full_name: "",
            email: "",
            phone: "",
            password: "",
        });
        setIsModalOpen(true)
    };

    const closeUserModal = () => {
        const modalElement = document.getElementById('otherUserModal');
        if (modalElement) {
            setIsModalOpen(false);
            window.HSOverlay.close(modalElement);
            setTimeout(() => setIsModalOpen(false), 500);
        }
    };

    useEffect(() => {
        const parentModal = document.querySelector('.parent-modal.open');
        const modalElement = document.getElementById('otherUserModal');
        if (modalElement) {
            isUserModalOpen ? window.HSOverlay.open(modalElement) : window.HSOverlay.close(modalElement);
            if (parentModal) {
                parentModal.classList.toggle('open', isUserModalOpen);
                modalElement.classList.toggle('open', isUserModalOpen);
                modalElement.classList.toggle('hidden', !isUserModalOpen);
            }
        }
    }, [isUserModalOpen]);

    const onUserSubmit = async (payload) => {
        try {
            await createOtherUser(payload);
            closeUserModal();
        } catch (error) {
            console.error("Failed to submit task:", error.message);
        }
    };

    return {
        openUserModal,
        closeUserModal,
        userControl: control,
        userErrors: errors,
        isSubmitting,
        handleSubmit,
        onUserSubmit,
        isUserModalOpen
    };
};