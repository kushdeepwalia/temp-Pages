import { useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ModelTable = (props) => {

    const fields = ["S.no", "Project Name", "Model Name", "Marker File", "Model" ,"Audio", "Video", "Text", "Timestamp", "Action"]

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
                    props.data.filter(obj => (obj.ProjectName.toLowerCase().includes(filterWord.toLowerCase())) ? true : (obj.ModelName.toLowerCase().includes(filterWord.toLowerCase()))).map((rowData, i) => (
                        <tr key={"table-row-" + i}>
                            <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.ProjectName}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.ModelName}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.MarkerFile}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Model}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Audio}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Video}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Text}</td>
                            <td className="h-12 px-4 text-left align-middle">{rowData.Timestamp}</td>
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

export default ModelTable