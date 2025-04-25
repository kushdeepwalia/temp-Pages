import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../utils/reactQuery';
import api from '../api';

export const useAddProjects = (tenantId) => {
  return useMutation({
    mutationFn: projectData => api.post(`/project/register`, projectData),

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['projects', tenantId]
      });
      const state = queryClient.getQueryState(['projects', tenantId]);
      console.log('Query state:', state);
    },
  });
};
