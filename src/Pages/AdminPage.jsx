import AdminTable from "../Components/Tables/AdminTable";
import Body from "../Components/Body"
import Header from "../Components/Header"
import SideBar from "../Components/SideBar"

// Icons:
import { FaPlus } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const AdminPage = () => {

    const dummyData = [
        {Name: "Dummy 1", Email: "dummy@gmail.com", Phone: "1111100000", Status: false}
    ]

    return <>
    <Header />
    <div className="flex">
        <SideBar activate="admin"/>
        <Body>
            <div className="flex flex-col w-[100%] h-[100%]">
                <div className="bg-slate-100 h-[68px] w-[100%] flex justify-between items-center pl-[16px] pr-[16px]">
                    <h2>Admin</h2>
                    <div className="flex gap-[16px] items-center">
                        <TfiReload className="hover:cursor-pointer" />
                        <div className="flex items-center hover:cursor-pointer"><p className="pr-[4px]">Add</p><FaPlus /></div>
                    </div>
                </div>
                <AdminTable data={dummyData} />
            </div>
        </Body>
    </div>
    </>
}

export default AdminPage