import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EquipmentReplaceFormModal from '@modules/inventory/models/EquipmentReplaceFormModal.jsx';
import { useEquipmentReplacement } from '@modules/inventory/hooks/inventoryReplaceHooks.js'; // <-- create similar hook
import LoadingSpinner from '@components/LoadingSpinner.jsx';

export default function EquipmentReplaceFormWrapper({
                                                        replaceId,
                                                        equipmentId,
                                                        isOpen,
                                                        onClose,
                                                        onSuccess
                                                    }) {
    console.log(`replaceId ${replaceId} equipmentId ${equipmentId}`);
    const [isInitialized, setIsInitialized] = useState(false);
    const isEditMode = Boolean(replaceId);

    const { replacement, loading } = useEquipmentReplacement(isEditMode ? replaceId : null);
    useEffect(() => {
        if (!isOpen) {
            setIsInitialized(false);
            return;
        }

        if (isEditMode) {
            if (!loading && replacement) {
                setIsInitialized(true);
            }
        } else {
            setIsInitialized(true);
        }
    }, [isOpen, isEditMode, loading, replacement]);

    if (!isOpen) return null;

    if (isEditMode && !isInitialized) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <EquipmentReplaceFormModal
            isOpen={isOpen}
            onClose={onClose}
            equipmentId={equipmentId}
            replaceData={isEditMode ? replacement : null}
            onSuccess={onSuccess}
        />
    );
}

EquipmentReplaceFormWrapper.propTypes = {
    replaceId: PropTypes.number,
    equipmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};
