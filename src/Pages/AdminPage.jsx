import { useState } from "react";
import AdminTable from "../Components/Tables/AdminTable";
import Body from "../Components/Body";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";

const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password] = useState(Math.random().toString(36).slice(-8));
  const [org, setOrg] = useState("");
  const [admins, setAdmins] = useState([
    { Name: "Dummy 1", Email: "dummy@gmail.com", Phone: "1111100000", Status: false },
  ]);
  const [orgOptions] = useState(["Org A", "Org B", "Org C"]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setOrg("");
  };

  const handleSubmit = () => {
    if (!name || !email || !phone || !org) {
      alert("Please fill all required fields.");
      return;
    }
    setAdmins((prev) => [...prev, { Name: name, Email: email, Phone: phone, Status: true }]);
    resetForm();
    setIsModalOpen(false);
  };

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
            <AdminTable data={admins} />
          </div>
        </Body>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setIsModalOpen(false)}>
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
            <input className="border w-full p-2 mb-4 bg-gray-100" value={password} readOnly />

            <label className="block mb-2">Organisation</label>
            <select className="border w-full p-2 mb-4" value={org} onChange={(e) => setOrg(e.target.value)}>
              <option value="">Select Organisation</option>
              {orgOptions.map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={resetForm}>Reset</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;