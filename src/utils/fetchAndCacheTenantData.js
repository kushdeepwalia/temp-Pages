// utils/fetchAndCacheTenantData.js
import { queryClient } from './reactQuery';
import api from '../api/';
import axios from 'axios';

export const fetchAndCacheTenantData = async (tenantId) => {
  const [orgs, projects, models, admins, states, approvals] = await Promise.all([
    api.get(`/org/getAll`),
    api.get(`/project/getAll`),
    api.get(`/model/getAll`),
    api.get(`/admin/getAll`),
    axios.get('https://api.data.gov.in/resource/a71e60f0-a21d-43de-a6c5-fa5d21600cdb?api-key=579b464db66ec23bdd00000142c630ed62984eec43d070c79fdd8f3f&format=json&limit=1000'),
    api.get(`/auth/user/approvals`)
  ]);

  console.log(orgs, projects, models, admins, states, approvals)

  queryClient.setQueryData(['tenantId'], tenantId);

  if (orgs.status === 200) queryClient.setQueryData(['organizations'], orgs.data.orgs);
  else if (orgs.status === 204) queryClient.setQueryData(['organizations'], []);

  if (projects.status === 200) queryClient.setQueryData(['projects'], projects.data.projects);
  else if (projects.status === 204) queryClient.setQueryData(['projects'], []);

  if (models.status === 200) queryClient.setQueryData(['models'], models.data.models);
  else if (models.status === 204) queryClient.setQueryData(['models'], []);

  if (admins.status === 200) queryClient.setQueryData(['admins'], admins.data.admins);
  else if (admins.status === 204) queryClient.setQueryData(['admins'], []);

  if (states.status === 200) queryClient.setQueryData(['allstates'], states.data.records);
  else queryClient.setQueryData(['admins'], []);

  if (approvals.data.length != 0) queryClient.setQueryData(['approvals'], approvals.data);
  else queryClient.setQueryData(['approvals'], []);
};
