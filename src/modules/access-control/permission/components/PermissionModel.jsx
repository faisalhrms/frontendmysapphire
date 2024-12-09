import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import {createPermission, updatePermission} from '@modules/access-control/services/accessService.js'
const PermissionModal = ({ isOpen, onClose, permission }) => {
  console.log(`this is permission`,permission)
  const [permissionName, setPermissionName] = useState('');
  const [permissionError, setPermissionError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (permission) {
      setPermissionName(permission.name); // Set the permission name when editing
    } else {
      setPermissionName(''); // Clear the field for new permission creation
    }
  }, [permission]);

  const permissionMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      setPermissionName('');
      onClose(); // Close the modal on success
    },
    onError: (error) => {
      setPermissionError(error.message);
    },
  });
  const updatePermissionMutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']); // Invalidate queries to refetch roles
      setPermissionName('');
      onClose();
    },
    onError: (error) => {
      setPermissionError(error.message);
    },
  });

  const resetPermissionForm = () => {
    setPermissionName('');
    setPermissionError('');
  };

  const handlePermissionSubmit = (e) => {
    e.preventDefault();
    if (!permissionName) {
      setPermissionError('Please fill in the permission name.');
      return;
    }
    setPermissionError('');
    if (permission && permission.id) {
      // Update role
      updatePermissionMutation.mutate({ id: permission.id, permissionData: { name: permissionName } });
    } else {
      permissionMutation.mutate({ name: permissionName });
    }

  };

  return (
    <>
      {isOpen && (
          <div className="hs-overlay fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
              <div className="ti-modal-content">
                <div className="ti-modal-header flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                  <h6 className="text-lg font-bold">{permission ? 'Edit Permission' : 'Create Permission'}</h6>
                  <button
                      type="button"
                      className="ti-modal-close-btn text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => {
                        resetPermissionForm();
                        onClose();
                      }}
                  >
                    <span className="sr-only">Cancel</span>
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <form onSubmit={handlePermissionSubmit}>
                  <div className="mt-4 border-b border-gray-200 pb-4">
                    <label htmlFor="input-permission" className="block py-3 text-sm font-bold">Permission</label>
                    <input
                        type="text"
                        className="form-control block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        id="input-permission"
                        placeholder="Enter Permission"
                        value={permissionName}
                        onChange={(e) => setPermissionName(e.target.value)}
                    />
                  </div>
                  {permissionError && (
                      <div className='alert alert-danger mt-4 text-rose-500 text-sm'>
                        {permissionError}
                      </div>
                  )}
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                        type="button"
                        className="ti-btn ti-btn-secondary-full px-2 py-1 text-sm"
                        onClick={() => {
                          resetPermissionForm();
                          onClose();
                        }}
                    >
                      Close
                    </button>
                    <button
                        type="submit"
                        className="ti-btn ti-btn-primary-full px-2 py-1 text-sm"
                        disabled={permissionMutation.isLoading || updatePermissionMutation.isLoading}
                    >
                      {permissionMutation.isLoading || updatePermissionMutation.isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default PermissionModal;
