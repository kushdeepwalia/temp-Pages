import React from 'react'
import { RxCheck, RxCross2, RxTrash } from 'react-icons/rx';
import { TbTrashFilled } from 'react-icons/tb';
import api from '../../api';
import { queryClient } from '../../utils/reactQuery';

const ApprovalTable = (props) => {

  const returnMonth = (month) => {
    switch (month + 1) {
      case 1: return "January";
      case 2: return "February";
      case 3: return "March";
      case 4: return "April";
      case 5: return "May";
      case 6: return "June";
      case 7: return "July";
      case 8: return "August";
      case 9: return "September";
      case 10: return "October";
      case 11: return "November";
      case 12: return "December";
      default: return "Invalid";
    }
  }

  return (
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
              DOB
            </th>
            <th className="h-12 px-4 text-left align-middle">
              State
            </th>
            <th className="h-12 px-4 text-left align-middle">
              District
            </th>
            <th className="h-12 px-4 text-left align-middle">
              Organization
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
            props.data.map((rowData, i) => (
              <tr key={"table-row-" + i}>
                <td className="h-12 px-4 text-left align-middle">{i + 1}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.name}</td>
                <td className="h-12 px-4 text-left align-middle">{new Date(rowData.dob).getDate() + " " + returnMonth(new Date(rowData.dob).getMonth()) + ", " + new Date(rowData.dob).getFullYear()}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.state}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.district}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.org_name}</td>
                <td className="h-12 px-4 text-left align-middle">{rowData.phone_no}</td>
                <td className="h-12 px-4 text-left capitalize align-middle">{rowData.status}</td>
                <td className="h-12 px-4 text-left align-middle">
                  <div className='flex justify-center'>
                    {
                      rowData.status === "pending" ?
                        <>
                          <div
                            onClick={async () => {
                              await api.patch('/auth/user/status/approved/' + rowData.id);
                              await queryClient.invalidateQueries({
                                queryKey: ['approvals']
                              })
                            }}
                            className='border-2 hover:text-white cursor-pointer border-green-400 hover:bg-green-400 text-green-400 w-max rounded'
                          >
                            <RxCheck size={24} className='font-bold' />
                          </div>
                          <div
                            onClick={async () => {
                              await api.patch('/auth/user/status/denied/' + rowData.id);
                              await queryClient.invalidateQueries({
                                queryKey: ['approvals']
                              })
                            }}
                            className='border-2 ml-2 hover:text-white cursor-pointer border-red-400 hover:bg-red-400 text-red-400 w-max rounded'
                          >
                            <RxCross2 size={24} className='font-bold' />
                          </div>
                        </>
                        :
                        <>
                          <div
                            onClick={async () => {
                              await api.delete('/auth/user/delete/' + rowData.id);
                              await queryClient.invalidateQueries({
                                queryKey: ['approvals']
                              })
                            }}
                            className='cursor-pointer text-red-400 w-max rounded'
                          >
                            <TbTrashFilled size={24} className='font-bold' />
                          </div>
                        </>
                    }
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ApprovalTable