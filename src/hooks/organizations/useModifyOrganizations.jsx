import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useModifyOrganizations = () => {
  return useMutation({
    mutationFn: ({ id, projectData }) => {
      console.log(projectData);
      api.put(`/org/modify/${id}`, projectData);
    },

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
