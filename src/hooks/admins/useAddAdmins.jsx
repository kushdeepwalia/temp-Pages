import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useAddAdmins = (tenantId) => {
  return useMutation({
    mutationFn: projectData => api.post(`/admin/register`, projectData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admins']
      });

      const state = queryClient.getQueryState(['admins']);
      console.log('Query state:', state);
    },
  });
};
