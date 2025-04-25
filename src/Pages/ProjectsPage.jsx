import { useQuery } from "@tanstack/react-query";
import Body from "../Components/Body"
import Button from "../Components/Button";
import Header from "../Components/Header"
import SideBar from "../Components/SideBar"
import ProjectTable from "../Components/Tables/ProjectTable";

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const ProjectPage = () => {

  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['tenantId']),  // retrieving data from cache
  });
  const { data: projects, isLoading: projectLoading, } = useQuery({
    queryKey: ['projects', tenantId],  // same key used for setQueryData
    queryFn: () => queryClient.getQueryData(['projects', tenantId]),  // retrieving data from cache
    enabled: !!tenantId // only enable the query if tenantId exists
  });
  return <>
    {projectLoading ?
      <>
      </>
      :
      <>
        <Header />
        <div className="flex">
          <SideBar activate="project" />
          <Body>
            <div className="flex flex-col w-[100%] h-[100%]">
              <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                <h2>Project</h2>
                <div className="flex gap-[16px] items-center">
                  <TfiReload className="hover:cursor-pointer" />
                  <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                </div>
              </div>
              <ProjectTable data={projects} />
            </div>
          </Body>
        </div>
      </>
    }
  </>
}

export default ProjectPage