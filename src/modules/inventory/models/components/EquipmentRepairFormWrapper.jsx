// EquipmentRepairFormWrapper.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EquipmentRepairFormModal from '@modules/inventory/models/EquipmentRepairFormModal.jsx';
import { useEquipmentRepair } from '@modules/inventory/hooks/inventoryRepairHooks.js';
import LoadingSpinner from '@components/LoadingSpinner.jsx';

export default function EquipmentRepairFormWrapper({
                                                       repairId,
                                                       equipmentId,
                                                       isOpen,
                                                       onClose,
                                                       onSuccess
                                                   }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const isEditMode = Boolean(repairId);

    const { repair, loading } = useEquipmentRepair(isEditMode ? repairId : null);

    useEffect(() => {
        if (!isOpen) {
            setIsInitialized(false);
            return;
        }

        if (isEditMode) {
            // For edit mode, wait for data to be loaded
            if (!loading && repair) {
                setIsInitialized(true);
            }
        } else {
            // For create mode, no need to wait for data
            setIsInitialized(true);
        }
    }, [isOpen, isEditMode, loading, repair]);

    // Don't render anything if modal is not open
    if (!isOpen) return null;

    // Show loading spinner while waiting for data in edit mode
    if (isEditMode && !isInitialized) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Render the form modal only when ready
    return (
        <EquipmentRepairFormModal
            isOpen={isOpen}
            onClose={onClose}
            equipmentId={equipmentId}
            repairData={isEditMode ? repair : null}
            onSuccess={onSuccess}
        />
    );
}

EquipmentRepairFormWrapper.propTypes = {
    repairId: PropTypes.number,
    equipmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};