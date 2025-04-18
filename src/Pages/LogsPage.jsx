import Body from "../Components/Body"
import Header from "../Components/Header"
import SideBar from "../Components/SideBar"
import LogsTable from "../Components/Tables/LogsTable";

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const LogsPage = () => {
    const dummyData = [
        {
            Project: "Project 1",
            Admin: "user 1",
            Model: "apple",
            Action: "Created / updated / Deleted or thier action"
        }
    ]
    return <>
    <Header />
    <div className='flex'>
        <SideBar activate="logs"/>
        <Body>
            <div className="flex flex-col w-[100%] h-[100%]">
                <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                    <h2>Logs</h2>
                    <div className="flex gap-[16px] items-center">
                        <TfiReload className="hover:cursor-pointer"/>
                        <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                    </div>
                </div>
                <LogsTable data={dummyData}/>
            </div>
        </Body>
    </div>
    </>
}

export default LogsPage