import Body from "../Components/Body"
import Header from "../Components/Header"
import OrganizationTable from "../Components/Tables/OrganizationTable"
import SideBar from "../Components/SideBar"

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";

import { useState } from "react";
import Button from "../Components/Button";
import { IoMdClose } from "react-icons/io";
import { useAddOrganizations } from "../hooks/organizations/useAddOrganizations";
import { queryClient } from "../utils/reactQuery";
import api from "../api";
import { useDeleteOrganizations } from "../hooks/organizations/useDeleteOrganizations";
import { useModifyOrganizations } from "../hooks/organizations/useModifyOrganizations";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import axios from "axios";

const OrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtData, setDistrictData] = useState([]);
  const [inputTypes, setInputTypes] = useState([]);
  const [outputTypes, setOutputTypes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [parentOrg, setParentOrg] = useState("");
  const [editableId, setEditableId] = useState();
  const [editableData, setEditableData] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({ itemName: "", itemId: "" });
  const [isCannotDeleteModalOpen, setIsCannotDeleteModalOpen] = useState(false)
  const [modalTimer, setModalTimer] = useState();

  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user.tenant_id
    },
  });
  const { data: organizations, isLoading: orgLoading, isError: orgError } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api.get(`/org/getAll`);
      return res.data.orgs;
    },
    enabled: !!tenantId
  });
  const { data: admins, isLoading: adminLoading, isError: adminError } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const res = await api.get(`/admin/getAll`);
      return res.data.admins;
    },
    enabled: !!tenantId
  });
  const { data: projects, isLoading: projectLoading, isError: projectError } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get(`/project/getAll`);
      return res.data.projects;
    },
    enabled: !!tenantId
  });
  const { data: allStates } = useQuery({
    queryKey: ['allstates'],
    queryFn: async () => {
      const res = await axios.get(`https://api.data.gov.in/resource/a71e60f0-a21d-43de-a6c5-fa5d21600cdb?api-key=579b464db66ec23bdd00000142c630ed62984eec43d070c79fdd8f3f&format=json&limit=1000`);
      return res.data.records;
    },
    enabled: !!tenantId,
    staleTime: Infinity
  });
  const { mutate: addOrg, isLoading: addingLoader } = useAddOrganizations();
  const { mutate: deleteOrg, isLoading: deletingLoader } = useDeleteOrganizations();
  const { mutate: modifyOrg, isLoading: modifyingLoader } = useModifyOrganizations();

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

  const getValidParentOrgs = (currentOrg) => {
    const getOrgById = (id) => organizations.find(o => Number(o.tenant_id) === Number(id));

    const isDescendant = (org, targetId) => {
      if (!org?.parent_tenant_id) return false;
      if (org.parent_tenant_id === targetId) return true;
      const parent = getOrgById(org.parent_tenant_id);
      return parent ? isDescendant(parent, targetId) : false;
    };

    return organizations.filter(org => {
      const notSelf = org.tenant_id !== currentOrg.tenant_id;
      const notDescendant = !isDescendant(org, currentOrg.tenant_id);
      return notSelf && notDescendant;
    });
  };

  useEffect(() => {
    if (editableId) {
      const selectedOrg = organizations.filter((org) => Number(org.tenant_id) === Number(editableId))[0]
      setProjectName(selectedOrg.org_name);
      setSelectedColor(selectedOrg.color_theme);
      setInputTypes(selectedOrg.allowed_inputs.slice(1, selectedOrg.allowed_inputs.length - 1).split(","));
      setOutputTypes(selectedOrg.allowed_outputs.slice(1, selectedOrg.allowed_outputs.length - 1).split(","));
      setParentOrg(selectedOrg.parent_tenant_id);
      setSelectedState(selectedOrg.state);
      handleFetchDistricts(allStates.filter((state) => state.state_name_english === selectedOrg.state)[0].state_code);
      setSelectedDistrict(selectedOrg.district);
      setEditableData(selectedOrg);
      console.log(getValidParentOrgs(selectedOrg))
      setIsModalOpen(true)
    }
  }, [editableId]);

  const handleFetchDistricts = (state_code) => {
    fetch(`https://api.data.gov.in/resource/37231365-78ba-44d5-ac22-3deec40b9197?api-key=579b464db66ec23bdd00000142c630ed62984eec43d070c79fdd8f3f&format=json&limit=1000&filters%5Bstate_code%5D=${state_code}`)
      .then((res) => res.json())
      .then((res) => {
        setDistrictData(res.records);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  const resetEditForm = () => {
    setProjectName(editableData.org_name);
    setSelectedColor(editableData.color_theme);
    setInputTypes(editableData.allowed_inputs.slice(1, editableData.allowed_inputs.length - 1).split(","));
    setOutputTypes(editableData.allowed_outputs.slice(1, editableData.allowed_outputs.length - 1).split(","));
    setParentOrg(editableData.parent_tenant_id);
    setSelectedState(editableData.state);
    handleFetchDistricts(allStates.filter((state) => state.state_name_english === editableData.state)[0].state_code);
    setSelectedDistrict(editableData.district);
  }

  const resetForm = () => {
    setProjectName("");
    setInputTypes([]);
    setOutputTypes([]);
    setSelectedColor("");
    setParentOrg("");
    setSelectedState("");
    setSelectedDistrict("");
    setDistrictData([]);
  };

  const handleEdit = () => {
    if (editableId) {
      if (
        projectName === editableData.org_name &&
        (JSON.stringify(inputTypes.sort((a, b) => a - b)) === JSON.stringify(editableData.allowed_inputs.slice(1, editableData.allowed_inputs.length - 1).split(",").sort((a, b) => a - b))) &&
        (JSON.stringify(outputTypes.sort((a, b) => a - b)) === JSON.stringify(editableData.allowed_outputs.slice(1, editableData.allowed_outputs.length - 1).split(",").sort((a, b) => a - b))) &&
        selectedColor === editableData.color_theme &&
        parentOrg === editableData.parent_tenant_id &&
        selectedState === editableData.state &&
        selectedDistrict === editableData.district
      ) {
        alert("No field is modified.");
        return;
      }

      const modifiedOrg = {
        name: projectName,
        allowed_inputs: inputTypes,
        allowed_outputs: outputTypes,
        color_theme: selectedColor,
        parent_tenant_id: parentOrg,
        state: selectedState,
        district: selectedDistrict
      };

      modifyOrg({ id: editableId, projectData: modifiedOrg });
      resetForm();
      setEditableId();
      setEditableData();
      setIsModalOpen(false);
    }
  }

  const handleSubmit = () => {
    if (!projectName || inputTypes.length === 0 || outputTypes.length === 0 || !parentOrg || !selectedState || !selectedDistrict) {
      // if (!projectName || inputTypes.length === 0 || outputTypes.length === 0 || !selectedColor || !parentOrg || !selectedState || !selectedDistrict) {
      console.log(projectName, inputTypes, outputTypes, selectedColor, parentOrg)
      alert("Please fill all required fields.");
      return;
    }
    const newOrg = {
      name: projectName,
      allowed_inputs: inputTypes,
      allowed_outputs: outputTypes,
      color_theme: "#ff0000",
      // color_theme: selectedColor,
      parent_tenant_id: parentOrg,
      state: selectedState,
      district: selectedDistrict
    };

    addOrg(newOrg);
    resetForm();
    setIsModalOpen(false);
  };

  const hasChildren = (selectedOrg) => {
    return organizations.some(org => org.parent_org_name === selectedOrg);
  };

  const handleDelete = (id, orgName) => {
    if (orgName in groupAdmins() || orgName in groupProjects() || hasChildren(orgName)) {
      console.log("Cannot delete")
      setDeleteModalData({ itemName: orgName, itemId: id });
      setIsCannotDeleteModalOpen(true);
      if (modalTimer) {
        clearTimeout(modalTimer)
      }
      setModalTimer(setTimeout(() => {
        setIsCannotDeleteModalOpen(false)
        setDeleteModalData({ itemName: "", itemId: "" })
      }, 5000))
    } else {
      setDeleteModalData({ itemName: orgName, itemId: id });
      setIsDeleteModalOpen(true);
    }
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteModalData({ itemName: "", itemId: "" })
  }

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
                    <TfiReload onClick={async () => await queryClient.invalidateQueries({
                      queryKey: ['organizations']
                    })} className="hover:cursor-pointer" />
                    <div
                      className={`flex items-center cursor-pointer `}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <p className="pr-1">Add</p>
                      <FaPlus />
                    </div>
                  </div>
                </div>
                <OrganizationTable setEditableId={setEditableId} handleDelete={handleDelete} data={organizations || []} projectData={groupProjects()} adminData={groupAdmins()} />
              </div>
            </Body>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px] relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-black"
                  onClick={() => {
                    resetForm();
                    setEditableId();
                    setEditableData();
                    setIsModalOpen(false);
                  }}
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

                {/* <label className="block mb-2">Select Color</label>
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
                </div> */}

                <label className="block mb-2">Pincode</label>
                <input
                  className="border w-full p-2 mb-4"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value)
                    if (e.target.value.length === 6 && e.target.value !== pincode) {
                      fetch('https://api.postalpincode.in/pincode/' + e.target.value)
                        .then((res) => res.json())
                        .then((res) => {
                          if (res[0].Status === "Error") {
                            alert("Enter correct pincode");
                          }
                          else {
                            setSelectedState(res[0].PostOffice[0].State)
                            setSelectedDistrict(res[0].PostOffice[0].District)
                          }
                        })
                        .catch((error) => console.error(error))
                    }
                    else if (e.target.value !== 6) {
                      setSelectedState("")
                      setSelectedDistrict("")
                    }
                  }}
                />
                <label className="block mb-2">State</label>
                <input
                  className="border w-full p-2 mb-4"
                  readOnly
                  placeholder="State"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                />
                <label className="block mb-2">District</label>
                <input
                  className="border w-full p-2 mb-4"
                  readOnly
                  placeholder="District"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                />

                <label className="block mb-2">Parent Organisation</label>
                <select
                  className="border w-full p-2 mb-4"
                  value={parentOrg}
                  onChange={(e) => setParentOrg(e.target.value)}
                >
                  <option value="">Select Parent</option>
                  {
                    editableId ?
                      getValidParentOrgs(editableData).map((org, index) => (
                        <option key={index} value={org.tenant_id}>{org.org_name}</option>
                      ))
                      :
                      organizations.map((org, index) => (
                        <option key={index} value={org.tenant_id}>{org.org_name}</option>
                      ))
                  }
                </select>

                <div className="flex justify-end gap-4">
                  <button className="bg-gray-300 px-4 py-2 rounded" onClick={editableId ? resetEditForm : resetForm}>Reset</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={editableId ? handleEdit : handleSubmit}> {addingLoader ? 'Adding...' : 'Add'}</button>
                </div>
              </div>
            </div>
          )}

          <DeleteConfirmationModal isOpen={isDeleteModalOpen} itemData={deleteModalData} closeModal={closeDeleteModal} deleteItem={deleteOrg} />

          {isCannotDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px] relative">

                <button className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
                  onClick={() => { setIsCannotDeleteModalOpen(false); setDeleteModalData({ itemName: "", itemId: "" }) }}>
                  <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Cannot Delete.</h2>
                <p className="block mb-2">Cannot delete organization {deleteModalData.itemName} because there are Admins and Projects for this organization.</p>
                <div className="flex justify-end gap-4">
                  <button className="bg-gray-300 px-4 py-2 rounded hover:cursor-pointer" onClick={() => { setIsCannotDeleteModalOpen(false); setDeleteModalData({ itemName: "", itemId: "" }) }}>
                    Ok
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
    }
  </>
}

export default OrganizationPage;