import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useDeleteAdmins = () => {
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/delete/${id}`),

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['admins']
      });
      const state = queryClient.getQueryState(['admins']);
      console.log('Query state:', state);
    },
  });
};
