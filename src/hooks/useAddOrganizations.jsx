import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../utils/reactQuery';
import api from '../api';

export const useAddOrganizations = (tenantId) => {
  return useMutation({
    mutationFn: projectData => api.post(`/org/register`, projectData),

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['organizations', tenantId]
      });
      await queryClient.refetchQueries({
        queryKey: ['organizations', tenantId]
      });
      const state = queryClient.getQueryState(['organizations', tenantId]);
      console.log('Query state:', state);
    },
  });
};
