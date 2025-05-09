import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../utils/reactQuery';
import api from '../api';

export const useAddModels = (tenantId) => {
  return useMutation({
    mutationFn: projectData => api.post(`/model/register`, projectData),

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['models']
      });
      const state = queryClient.getQueryState(['models']);
      console.log('Query state:', state);
    },
  });
};
