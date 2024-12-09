import { useState, useEffect } from 'react'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, updateRole } from "../../services/accessService";

const RoleModal = ({ isOpen, onClose, role }) => {
  const [roleName, setRoleName] = useState('');
  const [roleError, setRoleError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setRoleName(role?.name || '');
  }, [role]);

  const roleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      resetForm();
      onClose();
    },
    onError: (error) => setRoleError(error.message),
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      resetForm();
      onClose();
    },
    onError: (error) => setRoleError(error.message),
  });

  const resetForm = () => {
    setRoleName('');
    setRoleError('');
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (!roleName) return setRoleError('Please fill in the role name.');
    setRoleError('');
    
    const mutationFn = role?.id ? updateRoleMutation.mutate : roleMutation.mutate;
    mutationFn(role ? { id: role.id, roleData: { name: roleName } } : { name: roleName });
  };

  if (!isOpen) return null;

  return (
    <div className="hs-overlay fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50" 
         onClick={(e) => e.target.classList.contains('hs-overlay') && e.stopPropagation()}>
      <div className="ti-modal-content bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <form onSubmit={handleRoleSubmit}>
          <div className="mt-4 border-b border-gray-200 pb-4">
            <label htmlFor="input-role" className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              className="form-control block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="input-role"
              placeholder="Enter Role"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          {roleError && <div className='alert alert-danger mt-4 text-rose-500 text-sm'>{roleError}</div>}
          <div className="ti-modal-footer mt-6 flex justify-end space-x-2">
            <button type="button" className="ti-btn ti-btn-secondary-full px-4 py-2" onClick={() => { resetForm(); onClose(); }}>
              Close
            </button>
            <button type="submit" className="ti-btn ti-btn-primary-full px-4 py-2" disabled={roleMutation.isLoading || updateRoleMutation.isLoading}>
              {roleMutation.isLoading || updateRoleMutation.isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
