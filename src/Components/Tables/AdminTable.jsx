import { useEffect, useState } from "react";

// Icons:
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const AdminTable = (props) => {
  const [userId, setUserId] = useState(-1)
  const [userEmail, setUserEmail] = useState("")
  const [filterWord, setFilterWord] = useState("")

  useEffect(() => {
    if (userId === -1) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUserId(user.id)
      setUserEmail(user.email)
    }
  }, [userId])

  return <>
    <div className="overflow-auto">
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
              Email
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Phone No.
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Organization
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
            props.data.filter(obj => (obj.name?.toLowerCase().includes(filterWord.toLowerCase())) ? true : obj.email?.toLowerCase().includes(filterWord.toLowerCase())).map((rowData, i) => (
              <tr key={"table-row-" + i}>
                <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.name}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.email}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.phone_no}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.org_name}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.profile_status}</td>
                <td className="h-12 px-4 text-left align-middle">
                  <div className="flex gap-[8px]">
                    {
                      userId === "35" ?
                        <>
                          <FaRegEdit onClick={() => props.setEditableId(rowData.admin_id)} className="hover:cursor-pointer" />
                          <MdDeleteOutline onClick={() => props.handleDelete(rowData.admin_id, rowData.name)} className="hover:cursor-pointer" />
                        </>
                        :
                        Number(rowData.org_tenant_id) === 1 ?
                          <>
                            <FaRegEdit onClick={() => props.setEditableId(rowData.admin_id)} className="hover:cursor-pointer" />
                            <MdDeleteOutline onClick={() => props.handleDelete(rowData.admin_id, rowData.name)} className="hover:cursor-pointer" />
                          </>
                          :
                          <></>

                    }
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