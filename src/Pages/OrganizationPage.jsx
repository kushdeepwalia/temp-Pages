import Body from "../Components/Body"
import Header from "../Components/Header"
import OrganizationTable from "../Components/Tables/OrganizationTable"
import SideBar from "../Components/SideBar"

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useState } from "react";
import Button from "../Components/Button";
import { IoMdClose } from "react-icons/io";
import { useAddOrganizations } from "../hooks/useAddOrganizations";
import { queryClient } from "../utils/reactQuery";
import api from "../api";

const OrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [inputTypes, setInputTypes] = useState([]);
  const [outputTypes, setOutputTypes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [parentOrg, setParentOrg] = useState("");

  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: () => queryClient.getQueryData(['tenantId']),
  });
  const { data: organizations, isLoading: orgLoading, isError: orgError } = useQuery({
    queryKey: ['organizations', tenantId],
    queryFn: async () => {
      const res = await api.get(`/org/getAll`);
      return res.data.orgs;
    },
    enabled: !!tenantId
  });
  const { data: admins, isLoading: adminLoading, isError: adminError } = useQuery({
    queryKey: ['admins', tenantId],
    queryFn: async () => {
      const res = await api.get(`/admin/getAll`);
      return res.data.admins;
    },
    enabled: !!tenantId
  });
  const { data: projects, isLoading: projectLoading, isError: projectError } = useQuery({
    queryKey: ['projects', tenantId],
    queryFn: async () => {
      const res = await api.get(`/project/getAll`);
      return res.data.projects;
    },
    enabled: !!tenantId
  });
  const { mutate: addOrg, isLoading: addingLoader, isSuccess, isError, status } = useAddOrganizations(tenantId);

  const navigate = useNavigate()

  useEffect(() => {
    if (organizations === undefined || admins === undefined || projects === undefined) {
      navigate("/");
    }
  }, [])

  const groupAdmins = () => {
    return admins && admins?.reduce((grouped, admin) => {
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

  const groupProjects = () => {
    return projects && projects?.reduce((grouped, project) => {
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

  const handleInputTypeChange = (value) => {
    setInputTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleOutputTypeChange = (value) => {
    setOutputTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const resetForm = () => {
    setProjectName("");
    setInputTypes([]);
    setOutputTypes([]);
    setSelectedColor("");
    setParentOrg("");
  };

  const handleSubmit = () => {
    if (!projectName || inputTypes.length === 0 || outputTypes.length === 0 || !selectedColor || !parentOrg) {
      alert("Please fill all required fields.");
      return;
    }
    const newOrg = {
      name: projectName,
      allowed_inputs: inputTypes,
      allowed_outputs: outputTypes,
      color_theme: selectedColor,
      parent_tenant_id: parentOrg
    };

    addOrg(newOrg);
    resetForm();
    setIsModalOpen(false);
  };

  return <>
    {
      ((orgLoading || adminLoading || projectLoading) && (!orgError || !adminError || !projectError)) ?
        <></>
        :
        <>
          <Header />
          <div className="flex">
            <SideBar activate="organization" />
            <Body>
              <div className="flex flex-col w-full h-full">
                <div className="bg-slate-100 h-[68px] flex justify-between items-center px-4">
                  <h2>Organizations</h2>
                  <div className="flex gap-4 items-center">
                    <TfiReload className="hover:cursor-pointer" />
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <p className="pr-1">Add</p>
                      <FaPlus />
                    </div>
                  </div>
                </div>
                <OrganizationTable data={organizations || []} projectData={groupProjects()} adminData={groupAdmins()} />
              </div>
            </Body>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px] relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Add Organisation</h2>

                <label className="block mb-2">Organization Name</label>
                <input
                  className="border w-full p-2 mb-4"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />

                <label className="block mb-2">Allow Input</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['word', 'image'].map((val) => (
                    <label className="capitalize" key={val}>
                      <input
                        type="checkbox"
                        value={val}
                        checked={inputTypes.includes(val)}
                        onChange={() => handleInputTypeChange(val)}
                      /> &nbsp;{val}
                    </label>
                  ))}
                </div>

                <label className="block mb-2">Allow Output</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["word", "image", "audio", "video", "model"].map((val) => (
                    <label key={val} className="capitalize">
                      <input type="checkbox" value={val} checked={outputTypes.includes(val)} onChange={() => handleOutputTypeChange(val.toLowerCase())} /> {val}
                    </label>
                  ))}
                </div>

                <label className="block mb-2">Select Color</label>
                <div className="flex gap-4 mb-4">
                  {["#ff0000", "#008000", "#0000ff", "#adff2f"].map((color) => (
                    <div key={color} className={`border-2 rounded-full ${selectedColor === color ? "border-black" : "border-transparent"} p-0.5`}>
                      <div
                        className={`w-6 h-6 rounded-full cursor-pointer `}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    </div>
                  ))}
                </div>

                <label className="block mb-2">Parent Organisation</label>
                <select
                  className="border w-full p-2 mb-4"
                  value={parentOrg}
                  onChange={(e) => setParentOrg(e.target.value)}
                >
                  <option value="">Select Parent</option>
                  {organizations.map((org, index) => (
                    <option key={index} value={org.tenant_id}>{org.org_name}</option>
                  ))}
                </select>

                <div className="flex justify-end gap-4">
                  <button className="bg-gray-300 px-4 py-2 rounded" onClick={resetForm}>Reset</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}> {addingLoader ? 'Adding...' : 'Add'}</button>
                </div>
              </div>
            </div>
          )}
        </>
    }
  </>
}

export default OrganizationPage;