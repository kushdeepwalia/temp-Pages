import { useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ProjectTable = (props) => {

  const [filterWord, setFilterWord] = useState("")

  const arrayToString = (arr = "") => {
    const str = arr.slice(1, arr.length - 1);
    let finalString = '';
    if (str.includes(",")) {
      const array = str.split(",")

      for (let index = 0; index < array.length - 1; index++) {
        finalString += array[index] + ", "
      }
      finalString += array[array.length - 1]
    }
    else {
      finalString = str;
    }

    return finalString;
  }

  return <>
    <div>
      {/* <input type='text' className="border-b border-2" value={filterWord} placeholder="Search" onChange={(e) => { setFilterWord(e.target.value) }} /> */}
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
              Allowed Inputs
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Allowed Outputs
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {
            // Map obtained data to the table
            props.data.filter(obj => obj.name?.toLowerCase().includes(filterWord.toLowerCase())).map((rowData, i) => (
              <tr key={"table-row-" + i}>
                <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.name}</td>
                <td className="h-12 px-4 text-left align-middle">{arrayToString(rowData.allowed_inputs)}</td>
                <td className="h-12 px-4 text-left align-middle">{arrayToString(rowData.allowed_outputs)}</td>
                <td className="h-12 px-4 text-left align-middle">
                  <div className="flex gap-[8px]">
                    <FaRegEdit className="hover:cursor-pointer" />
                    <MdDeleteOutline className="hover:cursor-pointer" />
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

export default ProjectTable