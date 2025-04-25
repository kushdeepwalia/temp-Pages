import { useState } from "react";
import Body from "../Components/Body";
import Button from "../Components/Button";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import ProjectTable from "../Components/Tables/ProjectTable";
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";

const ProjectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [org, setOrg] = useState("");
  const [inputType, setInputType] = useState("");
  const [outputTypes, setOutputTypes] = useState([]);

  const [projects, setProjects] = useState([
    { Name: "Project 1" },
    { Name: "Project 2" },
  ]);

  const [orgOptions] = useState(["Org A", "Org B", "Org C"]);

  const resetForm = () => {
    setProjectName("");
    setOrg("");
    setInputType("");
    setOutputTypes([]);
  };

  const handleOutputChange = (value) => {
    setOutputTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (!projectName || !org || !inputType || outputTypes.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    setProjects((prev) => [...prev, { Name: projectName }]);
    resetForm();
    setIsModalOpen(false);
  };

  return (
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
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <p className="pr-1">Add</p>
                  <FaPlus />
                </div>
              </div>
            </div>
            <ProjectTable data={projects} />
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

            <h2 className="text-xl font-bold mb-4">Add Project</h2>

            <label className="block mb-2">Project Name</label>
            <input
              className="border w-full p-2 mb-4"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label className="block mb-2">Organisation</label>
            <select
              className="border w-full p-2 mb-4"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            >
              <option value="">Select Organisation</option>
              {orgOptions.map((o, i) => (
                <option key={i} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <label className="block mb-2">Allow Input</label>
            <div className="flex gap-4 mb-4">
              {["img", "word"].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name="inputType"
                    value={val}
                    checked={inputType === val}
                    onChange={(e) => setInputType(e.target.value)}
                  />{" "}
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </label>
              ))}
            </div>

            <label className="block mb-2">Allow Output</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {["word", "audio", "video", "image", "model"].map((val) => (
                <label key={val} className="capitalize">
                  <input
                    type="checkbox"
                    value={val}
                    checked={outputTypes.includes(val)}
                    onChange={() => handleOutputChange(val)}
                  />{" "}
                  {val}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={resetForm}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPage;
