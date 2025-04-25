import Body from "../Components/Body"
import Header from "../Components/Header"
import OrganizationTable from "../Components/Tables/OrganizationTable"
import SideBar from "../Components/SideBar"

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";

const OrganizationPage = () => {
  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['tenantId']),  // retrieving data from cache
  });
  const { data: organizations, isLoading: orgLoading, isError } = useQuery({
    queryKey: ['organizations', tenantId],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['organizations', tenantId]),  // retrieving data from cache
    enabled: !!tenantId // only enable the query if tenantId exists
  });
  const { data: admins, isLoading: adminLoading, } = useQuery({
    queryKey: ['admins', tenantId],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['admins', tenantId]),  // retrieving data from cache
    enabled: !!tenantId // only enable the query if tenantId exists
  });
  const { data: projects, isLoading: projectLoading, } = useQuery({
    queryKey: ['projects', tenantId],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['projects', tenantId]),  // retrieving data from cache
    enabled: !!tenantId // only enable the query if tenantId exists
  });

  const groupAdmins = (admins) => {
    return admins.reduce((grouped, admin) => {
      const { org_name } = admin;

      // If the group doesn't exist, create it
      if (!grouped[org_name]) {
        grouped[org_name] = [];
      }

      // Add the admin to the appropriate org group
      grouped[org_name].push(admin);
      return grouped;
    }, {});
  };

  const groupProjects = (projects) => {
    return projects.reduce((grouped, project) => {
      const { org_name } = project;

      // If the group doesn't exist, create it
      if (!grouped[org_name]) {
        grouped[org_name] = [];
      }

      // Add the project to the appropriate org group
      grouped[org_name].push(project);
      return grouped;
    }, {});
  };


  return <>
    {
      orgLoading || adminLoading || projectLoading ?
        <></>
        :
        <>
          <Header />
          <div className='flex'>
            <SideBar activate="organization" />
            <Body>
              <div className="flex flex-col w-[100%] h-[100%]">
                <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                  <h2>Organizations</h2>
                  <div className="flex gap-[16px] items-center">
                    <TfiReload className="hover:cursor-pointer" />
                    <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                  </div>
                </div>
                <OrganizationTable data={organizations} adminData={groupAdmins(admins)} projectData={groupProjects(projects)} />
              </div>
            </Body>
          </div>
        </>
    }
  </>
}

export default OrganizationPage