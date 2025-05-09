import { useEffect, useState } from "react";
import AdminTable from "../Components/Tables/AdminTable";
import Body from "../Components/Body";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { IoMdClose } from "react-icons/io";
import RandExp from 'randexp';
import { useAddAdmins } from "../hooks/admins/useAddAdmins";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useDeleteAdmins } from "../hooks/admins/useDeleteAdmins";
import { useModifyAdmins } from "../hooks/admins/useModifyAdmins";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";

const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("");
  const [editableId, setEditableId] = useState();
  const [editableData, setEditableData] = useState();
//   Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalData, setDeleteModalData] = useState({itemName: "", itemId: ""})
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,20}$/;

  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: () => queryClient.getQueryData(['tenantId']),
  });
  const { data: admins, isLoading: adminLoading, } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const res = await api.get(`/admin/getAll`);
      return res.data.admins;
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

  const { mutate: addAdmin, isLoading: addingLoader, isSuccess, isError, status } = useAddAdmins(tenantId);
  const { mutate: deleteAdmin, isLoading: deletingLoader } = useDeleteAdmins();
  const { mutate: modifyAdmin, isLoading: modifyingLoader } = useModifyAdmins();

  const generatePassword = () => {
    const pass = new RandExp(passwordRegex).gen();
    console.log(pass);
    setPassword(pass);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setOrg("");
    setPassword("")
  };

  useEffect(() => {
    if (editableId) {
      const selectedAdmin = admins.filter((admin) => Number(admin.admin_id) === Number(editableId))[0]
      setName(selectedAdmin.name);
      setEmail(selectedAdmin.email);
      setPhone(selectedAdmin.phone_no);
      setOrg(selectedAdmin.org_tenant_id);
      setPassword("noChange")
      setEditableData(selectedAdmin);
      setIsModalOpen(true)
    }
  }, [editableId]);

  const handleEdit = () => {
    if (editableId) {
      if (
        name === editableData.name &&
        email === editableData.email &&
        org === editableData.org_tenant_id &&
        phone === editableData.phone_no &&
        password === "noChange"
      ) {
        alert("No field is modified.");
        return;
      }

      const modifiedAdmin = {
        name,
        email,
        phone_no: phone,
        tenant_id: org,
        pass: password
      };

      modifyAdmin({ id: editableId, projectData: modifiedAdmin });
      resetForm();
      setEditableId();
      setEditableData();
      setIsModalOpen(false);
    }
  }

  const handleSubmit = () => {
    console.log(org)
    if (!name || !email || !phone || !org || !password) {
      alert("Please fill all required fields.");
      return;
    }

    const newAdmin = {
      name,
      email,
      phone_no: phone,
      tenant_id: org,
      pass: password
    }

    addAdmin(newAdmin)

    resetForm();
    setIsModalOpen(false);
  };

  const navigate = useNavigate()

  useEffect(() => {
    if (orgOptions === undefined || admins === undefined) {
      navigate("/");
    }
  }, [])

  const handleDelete = (id, adminName) => {
    setDeleteModalData({itemName: adminName, itemId: id})
    setIsDeleteModalOpen(true);
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteModalData({itemName: "", itemId: ""})
  }

  return (
    <>
      <Header />
      <div className="flex">
        <SideBar activate="admin" />
        <Body>
          <div className="flex flex-col w-full h-full">
            <div className="bg-slate-100 h-[68px] flex justify-between items-center px-4">
              <h2>Admin</h2>
              <div className="flex gap-4 items-center">
                <TfiReload className="hover:cursor-pointer" />
                <div className="flex items-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  <p className="pr-1">Add</p>
                  <FaPlus />
                </div>
              </div>
            </div>
            <AdminTable setEditableId={setEditableId} handleDelete={handleDelete} data={admins || []} />
          </div>
        </Body>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => { resetForm(); setIsModalOpen(false) }}>
              <IoMdClose size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Add Admin</h2>

            <label className="block mb-2">Name</label>
            <input className="border w-full p-2 mb-4" value={name} onChange={(e) => setName(e.target.value)} />

            <label className="block mb-2">Email ID</label>
            <input className="border w-full p-2 mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="block mb-2">Phone Number</label>
            <input className="border w-full p-2 mb-4" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label className="block mb-2">Password</label>
            <div className="flex mb-4">
              <input type="password" className="border w-4/5 p-2" value={password} readOnly />
              <button className="bg-blue-600 ml-2 cursor-pointer text-white px-4 rounded" onClick={generatePassword}>Generate</button>
            </div>

            <label className="block mb-2">Organisation</label>
            <select className="border w-full p-2 mb-4" value={org} onChange={(e) => setOrg(e.target.value)}>
              <option value="">Select Organisation</option>
              {orgOptions.map((o, i) => (
                <option key={i} value={o.tenant_id}>{o.org_name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={resetForm}>Reset</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={editableId ? handleEdit : handleSubmit}> {addingLoader ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal isOpen={isDeleteModalOpen} itemData={deleteModalData} closeModal={closeDeleteModal} deleteItem={deleteAdmin}/>
    </>
  );
};

export default AdminPage;