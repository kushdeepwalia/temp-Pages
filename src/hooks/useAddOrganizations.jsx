import { useMutation } from 'react-query';
import { queryClient } from '../utils/reactQuery';

export const useAddProject = (tenantId) => {
  return useMutation(
    projectData => api.post(`/org`, projectData),
    {
      onSuccess: () => {
        // Invalidate and refetch project list
        queryClient.invalidateQueries(['organizations', tenantId]);
      },
    }
  );
};
