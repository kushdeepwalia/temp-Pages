import Body from "../Components/Body"
import Button from "../Components/Button"
import Header from "../Components/Header"
import OrganizationTable from "../Components/Tables/OrganizationTable"
import SideBar from "../Components/SideBar"

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const OrganizationPage = () => {
    const dummyData = [
        {Name: "dummy 1", Admin: "3", Project: "5",},
        {Name: "dummy 2", Admin: "1", Project: "4",},
        {Name: "dummy 3", Admin: "1", Project: "4",},
        {Name: "dummy 4", Admin: "1", Project: "4",},
        {Name: "dummy 5", Admin: "1", Project: "4",},
        {Name: "dummy 6", Admin: "1", Project: "4",},
        {Name: "dummy 7", Admin: "1", Project: "4",},
        {Name: "dummy 8", Admin: "1", Project: "4",},
        {Name: "dummy 9", Admin: "1", Project: "4",},
        {Name: "dummy 10", Admin: "1", Project: "4",},
        {Name: "dummy 11", Admin: "1", Project: "4",},
        {Name: "dummy 12", Admin: "1", Project: "4",}
    ]
    return <>
    <Header />
    <div className='flex'>
        <SideBar activate="organization"/>
        <Body>
            <div className="flex flex-col w-[100%] h-[100%]">
                <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                    <h2>Organizations</h2>
                    <div className="flex gap-[16px] items-center">
                        <TfiReload className="hover:cursor-pointer"/>
                        <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                    </div>
                </div>
                <OrganizationTable data={dummyData}/>
            </div>
        </Body>
    </div>
    </>
}

export default OrganizationPage