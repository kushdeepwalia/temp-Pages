import { useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const LogsTable = (props) => {

    const fields = ["S.no", "Timestamp", "Project", "Admin", "Model" , "Action"]
    const [filterWord, setFilterWord] = useState("")

    return <>
    <div>
        <input type='text' className="border-b border-2" value={filterWord} placeholder="Search" onChange={(e) => {setFilterWord(e.target.value)}} />
        <table>
            <thead>
                <tr>
                    {
                        fields.map((tableField) => (
                            <th key={tableField} className="h-12 px-4 text-left align-middle">
                                {tableField}
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    // Map obtained data to the table
                    props.data.filter(obj => (obj.Project.toLowerCase().includes(filterWord.toLowerCase())) ? true : (obj.ModelName.toLowerCase().includes(filterWord.toLowerCase()))).map((rowData, i) => (
                        <tr key={"table-row-" + i}>
                            <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Timestamp}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Project}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Admin}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Model}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Action}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
    </>
}

export default LogsTable