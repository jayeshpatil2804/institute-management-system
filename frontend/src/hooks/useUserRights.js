import { useSelector } from 'react-redux';

/**
 * Custom hook to check user permissions for a specific page.
 * @param {string} pageName - The name of the page to check permissions for.
 * @returns {object} - { view: boolean, add: boolean, edit: boolean, delete: boolean, hasPermission: boolean }
 */
export const useUserRights = (pageName) => {
  const { user } = useSelector((state) => state.auth);
  const { myPermissions = [] } = useSelector((state) => state.userRights || {});

  // Super Admin has all access
  if (user && user.role === 'Super Admin') {
    return {
      view: true,
      add: true,
      edit: true,
      delete: true,
      hasPermission: true
    };
  }

  const permission = myPermissions.find(p => p.page === pageName);

  if (!permission) {
    return {
      view: false,
      add: false,
      edit: false,
      delete: false,
      hasPermission: false
    };
  }

  return {
    view: permission.view,
    add: permission.add,
    edit: permission.edit,
    delete: permission.delete,
    hasPermission: permission.view // Alias for 'view' mainly used for route guarding
  };
};
