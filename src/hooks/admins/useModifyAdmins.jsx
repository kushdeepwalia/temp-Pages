import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useModifyAdmins = () => {
  return useMutation({
    mutationFn: ({ id, projectData }) => {
      console.log(projectData);
      api.put(`/admin/modify/${id}`, projectData);
    },

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
