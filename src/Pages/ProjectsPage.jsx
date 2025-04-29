import { useQuery } from "@tanstack/react-query";
import Body from "../Components/Body"
import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import ProjectTable from "../Components/Tables/ProjectTable";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAddProjects } from "../hooks/projects/useAddProjects";
import { useDeleteProjects } from "../hooks/projects/useDeleteProjects";
import { useModifyProjects } from "../hooks/projects/useModifyProjects";

const ProjectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [org, setOrg] = useState("");
  const [inputType, setInputType] = useState("");
  const [allowedInputType, setAllowedInputType] = useState(["word", "image"]);
  const [allowedOutputTypes, setAllowedOutputTypes] = useState(["word", "audio", "video", "image", "model"]);
  const [editableId, setEditableId] = useState();
  const [editableData, setEditableData] = useState();
  const [outputTypes, setOutputTypes] = useState([]);
//   Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalProjectName, setDeleteModalProjectName] = useState("")
  const [deleteId, setDeleteId] = useState("");
  const [inputConfirmDeleteWord, setInputConfirmDeleteWord] = useState("");
  const [inputDeleteConfirm, setInputDeleteConfirm] = useState("");
  const [isCannotDeleteModalOpen, setIsCannotDeleteModalOpen] = useState(false)
  const [modalTimer, setModalTimer] = useState()

  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: () => queryClient.getQueryData(['tenantId']),
  });
  const { data: projects, isLoading: projectLoading, } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get(`/project/getAll`);
      return res.data.projects;
    },
    enabled: !!tenantId
  });
  const { data: orgOptions, isLoading: orgLoading, isError: orgError } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api.get(`/org/getAll`);
      return res.data.orgs;
    },
    enabled: !!tenantId
  });
  const { mutate: addProject, isLoading: addingLoader, isSuccess, isError, status } = useAddProjects(tenantId);
  const { mutate: deleteProject, isLoading: deletingLoader } = useDeleteProjects();
  const { mutate: modifyProject, isLoading: modifyingLoader } = useModifyProjects();

  const navigate = useNavigate()

  useEffect(() => {
    if (projects === undefined) {
      navigate("/");
    }
  }, [])


  const getAllowedData = (org) => {
    setOrg(org)
    if (org) {
      const { allowed_inputs, allowed_outputs } = orgOptions.filter((o) => o.tenant_id === org)[0];
      const inputs = allowed_inputs?.slice(1, allowed_inputs?.length - 1);
      const outputs = allowed_outputs?.slice(1, allowed_outputs?.length - 1);

      if (inputs.includes(",")) {
        console.log(inputs.split(","))
        setAllowedInputType(inputs.split(","))
      }
      else {
        console.log([inputs])
        setAllowedInputType([inputs])
      }
      if (outputs.includes(",")) {
        console.log(outputs.split(","))
        setAllowedOutputTypes(outputs.split(","))
      }
      else {
        console.log([outputs])
        setAllowedOutputTypes([outputs])
      }
    }
  }

  const handleOutputChange = (value) => {
    setOutputTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const resetForm = () => {
    setProjectName("");
    setOrg("");
    setInputType("");
    setOutputTypes([]);
  };

  useEffect(() => {
    if (editableId) {
      const selectedOrg = projects.filter((pro) => Number(pro.id) === Number(editableId))[0]
      console.log(selectedOrg);
      setProjectName(selectedOrg.name);
      setInputType(selectedOrg.allowed_inputs.slice(1, selectedOrg.allowed_inputs.length - 1));
      setOutputTypes(selectedOrg.allowed_outputs.slice(1, selectedOrg.allowed_outputs.length - 1).split(","));
      setOrg(selectedOrg.org_tenant_id);
      setEditableData(selectedOrg);
      setIsModalOpen(true)
    }
  }, [editableId]);

  const handleEdit = () => {
    if (editableId) {
      if (
        projectName === editableData.name &&
        (inputType === editableData.allowed_inputs.slice(1, editableData.allowed_inputs.length - 1)) &&
        (JSON.stringify(outputTypes.sort((a, b) => a - b)) === JSON.stringify(editableData.allowed_outputs.slice(1, editableData.allowed_outputs.length - 1).split(",").sort((a, b) => a - b))) &&
        org === editableData.org_tenant_id
      ) {
        alert("No field is modified.");
        return;
      }

      const modifiedProject = {
        name: projectName,
        allowed_inputs: [inputType],
        allowed_outputs: outputTypes,
        tenant_id: org
      }

      modifyProject({ id: editableId, projectData: modifiedProject });
      resetForm();
      setEditableId();
      setEditableData();
      setIsModalOpen(false);
    }
  }

  const handleSubmit = () => {
    if (!projectName || !org || !inputType || outputTypes.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    const newProject = {
      name: projectName,
      allowed_inputs: [inputType],
      allowed_outputs: outputTypes,
      tenant_id: org
    }

    addProject(newProject)

    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (id, projName) => {
    if (false){
        console.log("Cannot delete")
        setDeleteModalProjectName(projName);
        setIsCannotDeleteModalOpen(true);
        if (modalTimer){
            clearTimeout(modalTimer)
        }
        setModalTimer(setTimeout(() => {
            setDeleteModalProjectName("")
            setIsCannotDeleteModalOpen(false)
        }, 5000))
    } else {
        setIsDeleteModalOpen(true);
        setDeleteModalProjectName(projName);
        setDeleteId(id);
    }
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInputConfirmDeleteWord("");
    setInputDeleteConfirm("");
    setDeleteId("")
  }

  return <>
    {
      projectLoading ?
        <>
        </>
        :
        <>
          <Header />
          <div className="flex">
            <SideBar activate="project" />
            <Body>
              <div className="flex flex-col w-full h-full">
                <div className="bg-slate-100 h-[68px] flex justify-between items-center px-4">
                  <h2>Project</h2>
                  <div className="flex gap-4 items-center">
                    <TfiReload className="hover:cursor-pointer" />
                    <div className="flex items-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
                      <p className="pr-1">Add</p>
                      <FaPlus />
                    </div>
                  </div>
                </div>
                <ProjectTable setEditableId={setEditableId} handleDelete={handleDelete} data={projects || []} />
              </div>
            </Body>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px] relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setIsModalOpen(false)}>
                  <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Add Project</h2>

                <label className="block mb-2">Project Name</label>
                <input className="border w-full p-2 mb-4" value={projectName} onChange={(e) => setProjectName(e.target.value)} />

                <label className="block mb-2">Organisation</label>
                <select className="border w-full p-2 mb-4" value={org} onChange={(e) => getAllowedData(e.target.value)}>
                  <option value="">Select Organisation</option>
                  {orgOptions.map((o, i) => (
                    <option key={i} value={o.tenant_id}>{o.org_name}</option>
                  ))}
                </select>
                {
                  org ?
                    <>
                      <label className="block mb-2">Allow Input</label>
                      <div className="flex gap-4 mb-4">
                        {allowedInputType.map((val) => (
                          <label key={val}>
                            <input
                              type="radio"
                              name="inputType"
                              value={val}
                              checked={inputType === val}
                              onChange={(e) => setInputType(e.target.value)}
                            /> {val.charAt(0).toUpperCase() + val.slice(1)}
                          </label>
                        ))}
                      </div>

                      <label className="block mb-2">Allow Output</label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {allowedOutputTypes.map((val) => (
                          <label key={val} className="capitalize">
                            <input
                              type="checkbox"
                              value={val}
                              checked={outputTypes.includes(val)}
                              onChange={() => handleOutputChange(val)}
                            /> {val}
                          </label>
                        ))}
                      </div>
                    </>
                    :
                    <>
                    </>
                }

                <div className="flex justify-end gap-4">
                  <button className="bg-gray-300 px-4 py-2 rounded" onClick={resetForm}>Reset</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={editableId ? handleEdit : handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          )}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-[400px] relative">

                    <button className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
                        onClick={() => closeDeleteModal()}>
                        <IoMdClose size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>

                    <label className="block mb-2">Enter "{deleteModalProjectName}" to Confirm</label>
                    <input
                        className="border w-full p-2 mb-4"
                        value={inputConfirmDeleteWord}
                        onChange={(e) => setInputConfirmDeleteWord(e.target.value)}
                    />
                    
                    <label className="block mb-2">Enter "delete" to Confirm</label>
                    <input
                        className="border w-full p-2 mb-4"
                        value={inputDeleteConfirm}
                        onChange={(e) => setInputDeleteConfirm(e.target.value)}
                    />

                    <div className="flex justify-between gap-4">
                        <button className={(inputDeleteConfirm === "delete" && inputConfirmDeleteWord === deleteModalProjectName) ? "bg-red-400 text-white px-4 py-2 rounded hover:cursor-pointer" : "bg-gray-300 px-4 py-2 rounded"}
                            disabled={!(inputDeleteConfirm === "delete" && inputConfirmDeleteWord === deleteModalProjectName)}
                            onClick={ () => {
                                deleteProject(deleteId);
                                closeDeleteModal();
                            }
                        }>
                            Delete
                        </button>
                        <button className="bg-gray-300 px-4 py-2 rounded hover:cursor-pointer" onClick={() => {closeDeleteModal()}}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
          )}
          {isCannotDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-[400px] relative">

                    <button className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
                        onClick={() => {setIsCannotDeleteModalOpen(false); setDeleteModalProjectName("")}}>
                        <IoMdClose size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Cannot Delete.</h2>
                    <p className="block mb-2">Cannot delete Project {deleteModalProjectName} because there is modal data of this project.</p>
                    <div className="flex justify-end gap-4">
                        <button className="bg-gray-300 px-4 py-2 rounded hover:cursor-pointer" onClick={() => {setIsCannotDeleteModalOpen(false); setDeleteModalProjectName("")}}>
                            Ok
                        </button>
                    </div>
                </div>
            </div>
          )}
        </>
    }
  </>
};


export default ProjectPage;