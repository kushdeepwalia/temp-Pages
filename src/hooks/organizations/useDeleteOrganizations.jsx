import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useDeleteOrganizations = () => {
  return useMutation({
    mutationFn: (id) => api.delete(`/org/delete/${id}`),

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['organizations']
      });
      const state = queryClient.getQueryState(['organizations']);
      console.log('Query state:', state);
    },
  });
};
