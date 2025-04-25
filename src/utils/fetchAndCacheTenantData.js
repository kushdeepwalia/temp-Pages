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
  if (orgs.status === 200) queryClient.setQueryData(['organizations', tenantId], orgs.data.orgs);
  if (projects.status === 200) queryClient.setQueryData(['projects', tenantId], projects.data.projects);
  if (models.status === 200) queryClient.setQueryData(['models', tenantId], models.data.models);
  if (admins.status === 200) queryClient.setQueryData(['admins', tenantId], admins.data.admins);
};
