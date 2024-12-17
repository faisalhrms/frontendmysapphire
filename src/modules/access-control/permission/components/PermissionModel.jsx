import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createPermission, updatePermission } from '@modules/access-control/services/accessService.js';

const PermissionModal = ({ isOpen, onClose, permission }) => {
  console.log(`this is permission`, permission);

  // State variables for name and codename
  const [permissionName, setPermissionName] = useState('');
  const [permissionCodename, setPermissionCodename] = useState('');
  const [permissionError, setPermissionError] = useState('');

  const queryClient = useQueryClient();

  // Populate form fields when editing a permission
  useEffect(() => {
    if (permission) {
      setPermissionName(permission.name || '');
      setPermissionCodename(permission.codename || '');
    } else {
      setPermissionName('');
      setPermissionCodename('');
    }
  }, [permission]);

  // Mutation for creating a new permission
  const permissionMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      resetPermissionForm();
      onClose(); // Close the modal on success
    },
    onError: (error) => {
      setPermissionError(error.message || 'An error occurred while creating the permission.');
    },
  });

  // Mutation for updating an existing permission
  const updatePermissionMutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']); // Invalidate queries to refetch permissions
      resetPermissionForm();
      onClose();
    },
    onError: (error) => {
      setPermissionError(error.message || 'An error occurred while updating the permission.');
    },
  });

  // Reset form fields and errors
  const resetPermissionForm = () => {
    setPermissionName('');
    setPermissionCodename('');
    setPermissionError('');
  };

  // Handle form submission for creating/updating permission
  const handlePermissionSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!permissionName.trim() || !permissionCodename.trim()) {
      setPermissionError('Please fill in both the permission name and codename.');
      return;
    }

    // Clear previous errors
    setPermissionError('');

    // Prepare the payload
    const payload = {
      name: permissionName.trim(),
      codename: permissionCodename.trim(),
    };

    if (permission && permission.id) {
      // Update existing permission
      updatePermissionMutation.mutate({ id: permission.id, permissionData: payload });
    } else {
      // Create new permission
      permissionMutation.mutate(payload);
    }
  };

  return (
      <>
        {isOpen && (
            <div className="hs-overlay fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                <div className="ti-modal-content">
                  <div className="ti-modal-header flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                    <h6 className="text-lg font-bold">
                      {permission ? 'Edit Permission' : 'Create Permission'}
                    </h6>
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
                    <div className=" border-gray-200">
                      {/* Permission Codename Input */}
                      <label htmlFor="input-permission-codename" className="block py-3 text-sm font-bold">
                         Codename
                      </label>
                      <input
                          type="text"
                          className="form-control mb-2 block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          id="input-permission-codename"
                          placeholder="Enter Permission Codename"
                          value={permissionCodename}
                          onChange={(e) => setPermissionCodename(e.target.value)}
                      />
                      <small className="text-gray-500 text-xs">
                        Use a unique identifier, e.g., <code>add_group</code>
                      </small>
                    </div>
                    <div className=" border-gray-200 pb-2">
                      {/* Permission Name Input */}
                      <label htmlFor="input-permission-name" className="block py-3 text-sm font-bold">
                        Description
                      </label>
                      <input
                          type="text"
                          className="form-control mb-2 block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          id="input-permission-name"
                          placeholder="Enter Permission Description"
                          value={permissionName}
                          onChange={(e) => setPermissionName(e.target.value)}
                      />
                      <small className="text-gray-500 text-xs">
                        Description format, e.g., <code>Can manage permission</code>
                      </small>
                    </div>


                    {permissionError && (
                        <div className="alert alert-danger mt-4 text-rose-500 text-sm">
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
