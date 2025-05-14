import React, { useState } from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import Body from '../Components/Body'
import { TfiReload } from 'react-icons/tfi'
import { queryClient } from '../utils/reactQuery'
import { FaPlus } from 'react-icons/fa'
import api from '../api'
import { useQuery } from '@tanstack/react-query'
import ApprovalTable from '../Components/Tables/ApprovalTable'

const ApprovalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tenantId } = useQuery({
    queryKey: ['tenantId'],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user.tenant_id
    },
  });
  const { data: approvals, isLoading: approvalLoading, } = useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      const res = await api.get(`/auth/user/approvals`);
      return res.data;
    },
    enabled: !!tenantId
  });

  return (
    <>
      <Header />
      <div className="flex">
        <SideBar activate="approval" />
        <Body>
          <div className="flex flex-col w-full h-full">
            <div className="bg-slate-100 h-[68px] flex justify-between items-center px-4">
              <h2>User Approvals</h2>
              <div className="flex gap-4 items-center">
                <TfiReload onClick={async () => await queryClient.invalidateQueries({
                  queryKey: ['approvals']
                })} className="hover:cursor-pointer" />
                <div className="flex items-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  <p className="pr-1">Add</p>
                  <FaPlus />
                </div>
              </div>
            </div>
            <ApprovalTable data={approvals || []} />
          </div>
        </Body>
      </div>
    </>
  )
}

export default ApprovalPage