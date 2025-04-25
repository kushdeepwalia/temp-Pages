import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useOrganizations = tenantId => {
  return useQuery(
    ['organizations', tenantId],
    () => api.get(`/org`).then(res => res.data),
    {
      enabled: !!tenantId, // Don't run query if tenantId is falsy
    }
  );
};