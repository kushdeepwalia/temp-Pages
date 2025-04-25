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

  queryClient.setQueryData(['tenantId'], tenantId);

  if (orgs.status === 200) queryClient.setQueryData(['organizations'], orgs.data.orgs);
  else if (orgs.status === 204) queryClient.setQueryData(['organizations'], []);

  if (projects.status === 200) queryClient.setQueryData(['projects'], projects.data.projects);
  else if (projects.status === 204) queryClient.setQueryData(['projects'], []);

  if (models.status === 200) queryClient.setQueryData(['models'], models.data.models);
  else if (models.status === 204) queryClient.setQueryData(['models'], []);

  if (admins.status === 200) queryClient.setQueryData(['admins'], admins.data.admins);
  else if (admins.status === 204) queryClient.setQueryData(['admins'], []);
};
