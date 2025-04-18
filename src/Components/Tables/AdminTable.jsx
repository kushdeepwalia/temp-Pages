import { useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const AdminTable = (props) => {
    
    const [filterWord, setFilterWord] = useState("")

    return <>
    <div>
        <input type='text' className="border-b border-2" value={filterWord} placeholder="Search" onChange={(e) => {setFilterWord(e.target.value)}} />
        <table>
            <thead>
                <tr>
                    <th className="h-12 px-4 text-left align-middle">
                        S.No
                    </th>
                    <th className="h-12 px-4 text-left align-middle">
                        Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle">
                        Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle">
                        Phone No.
                    </th>
                    <th className="h-12 px-4 text-left align-middle">
                        Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    // Mapp obtained data to the table
                    props.data.filter(obj => (obj.Name.toLowerCase().includes(filterWord.toLowerCase())) ? true : obj.Email.toLowerCase().includes(filterWord.toLowerCase())).map((rowData, i) => (
                        <tr key={"table-row-" + i}>
                            <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Name}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Email}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Phone}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Status}</td>
                            <td className="h-12 px-4 text-left align-middle">
                                <div className="flex gap-[8px]">
                                    <FaRegEdit className="hover:cursor-pointer"/>
                                    <MdDeleteOutline className="hover:cursor-pointer"/>
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>    
        </table>
    </div>
    </>
}

export default AdminTable