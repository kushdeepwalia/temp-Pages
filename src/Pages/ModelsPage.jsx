import Body from "../Components/Body"
import Header from "../Components/Header"
import SideBar from "../Components/SideBar"
import ModelTable from "../Components/Tables/ModelsTable";

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const ModelsPage = () => {

    const dummyData = [
        {
            ProjectName: "Project 1",
            ModelName: "Apple",
            MarkerFile: "Apple.png",
            Model: "",
            Audio: "apple.mp3",
            Video: "apple.mp4",
            Text: "",
            Timestamp: "03/3/2025"
        }
    ]

    return <>
    <Header />
    <div className="flex">
        <SideBar activate="model"/>
        <Body>
            <div className="flex flex-col w-[100%] h-[100%]">
                <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                    <h2>Models</h2>
                    <div className="flex gap-[16px] items-center">
                        <TfiReload className="hover:cursor-pointer"/>
                        <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                    </div>
                </div>
                <ModelTable data={dummyData}/>
            </div>
        </Body>
    </div>
    </>
}

export default ModelsPage