// utils/fetchAndCacheTenantData.js
import { queryClient } from './reactQuery';
import api from '../api/';

export const fetchAndCacheTenantData = async (tenantId) => {
  const [orgs, projects, models, admins] = await Promise.all([
    api.get(`/org/getAll`),
    api.get(`/project/getAll`),
    api.get(`/model/getAll`),
    api.get(`/admin/getAll`),
  ]);

  console.log(orgs, projects, models, admins)

  const dataFetched_At = new Date().toISOString();

  queryClient.setQueryData(['tenantId'], tenantId);
  queryClient.setQueryData(['dataFetched_At']);

  if (orgs.status === 200) queryClient.setQueryData(['organizations', tenantId], orgs.data.orgs);
  else if (orgs.status === 204) queryClient.setQueryData(['organizations', tenantId], []);

  if (projects.status === 200) queryClient.setQueryData(['projects', tenantId], projects.data.projects);
  else if (projects.status === 204) queryClient.setQueryData(['projects', tenantId], []);

  if (models.status === 200) queryClient.setQueryData(['models', tenantId], models.data.models);
  else if (models.status === 204) queryClient.setQueryData(['models', tenantId], []);

  if (admins.status === 200) queryClient.setQueryData(['admins', tenantId], admins.data.admins);
  else if (admins.status === 204) queryClient.setQueryData(['admins', tenantId], []);
};
