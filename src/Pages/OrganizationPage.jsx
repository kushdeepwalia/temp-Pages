import { useState } from "react";
import Body from "../Components/Body";
import Button from "../Components/Button";
import Header from "../Components/Header";
import OrganizationTable from "../Components/Tables/OrganizationTable";
import SideBar from "../Components/SideBar";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const OrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [inputType, setInputType] = useState("");
  const [outputTypes, setOutputTypes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [orgs, setOrgs] = useState([
    { Name: "dummy 1", Admin: "3", Project: "5" },
    { Name: "dummy 2", Admin: "1", Project: "4" },
  ]);

  const handleCheckboxChange = (value) => {
    setOutputTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const resetForm = () => {
    setProjectName("");
    setInputType("");
    setOutputTypes([]);
    setSelectedColor("");
  };

  const handleSubmit = () => {
    if (!projectName || !inputType || outputTypes.length === 0 || !selectedColor) {
      alert("Please fill all required fields.");
      return;
    }
    const newOrg = {
      Name: projectName,
      Admin: "1",
      Project: outputTypes.length.toString(),
    };
    setOrgs((prev) => [...prev, newOrg]);
    resetForm();
    setIsModalOpen(false);
  };

  return (
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
            <OrganizationTable data={orgs} />
          </div>
        </Body>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add Organisation</h2>

            <label className="block mb-2">Project Name</label>
            <input
              className="border w-full p-2 mb-4"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label className="block mb-2">Allow Input</label>
            <div className="flex gap-4 mb-4">
              <label><input type="radio" name="input" value="img" checked={inputType === "img"} onChange={(e) => setInputType(e.target.value)} /> Img</label>
              <label><input type="radio" name="input" value="word" checked={inputType === "word"} onChange={(e) => setInputType(e.target.value)} /> Word</label>
            </div>

            <label className="block mb-2">Allow Output</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {["word", "audio", "video", "image", "model"].map((val) => (
                <label key={val} className="capitalize">
                  <input type="checkbox" value={val} checked={outputTypes.includes(val)} onChange={() => handleCheckboxChange(val)} /> {val}
                </label>
              ))}
            </div>

            <label className="block mb-2">Select Color</label>
            <div className="flex gap-4 mb-4">
              {["red", "green", "blue", "yellow"].map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? "border-black" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>

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

export default OrganizationPage;
