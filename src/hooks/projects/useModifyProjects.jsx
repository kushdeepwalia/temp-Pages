import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/reactQuery';
import api from '../../api';

export const useModifyProjects = () => {
  return useMutation({
    mutationFn: ({ id, projectData }) => {
      console.log(projectData);
      api.put(`/project/modify/${id}`, projectData);
    },

    onSuccess: async () => {
      console.log("success");
      await queryClient.invalidateQueries({
        queryKey: ['projects']
      });
      const state = queryClient.getQueryState(['projects']);
      console.log('Query state:', state);
    },
  });
};
